import { asyncMap, omit, pick } from 'convex-helpers'
import { deprecated, literals, nullable, partial } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { emptyPage, generateSlug, paginatedReturnFields } from '../lib/utils'
import { runConfigV, threadFields } from '../schema'
import { createMessage, getMessageEdges, messageReturnFields } from './messages'
import { getChatModelByResourceKey } from './models'
import { getUserIsViewer, getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type {
  Ent,
  EntWriter,
  EThread,
  MutationCtx,
  QueryCtx,
  RunConfig,
  RunConfigChat,
  RunConfigTextToAudio,
  ThreadActionResult,
} from '../types'

export const threadReturnFields = {
  _id: v.string(),
  _creationTime: v.number(),
  slug: v.string(),
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),

  updatedAtTime: v.number(),
  favourite: v.optional(v.boolean()),
  userId: v.id('users'),
  userIsViewer: v.boolean(),
  user: v.any(),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  latestRunConfig: v.optional(v.any()),

  favorite: deprecated,
  voiceovers: deprecated,
}

// * Helpers

const getMessageBySeries = async (
  ctx: QueryCtx,
  { threadId, series }: { threadId: Id<'threads'>; series: number },
) => {
  const messageEnt = await ctx.table('messages').get('threadId_series', threadId, series)
  if (!messageEnt || messageEnt?.deletionTime) return null

  return await getMessageEdges(ctx, messageEnt)
}

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const getThreadEdges = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  return {
    ...thread,
    user: await getUserPublic(ctx, thread.userId),
    userIsViewer: getUserIsViewer(ctx, thread.userId),
  }
}

const getEmptyThread = async (ctx: QueryCtx): Promise<EThread | null> => {
  const viewer = await ctx.viewer()
  const user = viewer ? await getUserPublic(ctx, viewer._id) : null
  if (!user) return null

  return {
    _id: 'new' as Id<'threads'>,
    _creationTime: Date.now(),
    slug: 'new',
    title: 'New Thread',

    updatedAtTime: Date.now(),
    userId: user._id,
    userIsViewer: true,
    user,
  }
}

export const getOrCreateUserThread = async (ctx: MutationCtx, threadId?: string) => {
  const user = await ctx.viewerX()

  if (!threadId || threadId === 'new') {
    // * create thread
    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        slug: await generateSlug(ctx),
        updatedAtTime: Date.now(),
      })
      .get()

    return thread
  }

  const id = ctx.table('threads').normalizeId(threadId)
  const thread = id ? await ctx.table('threads').getX(id) : null

  if (thread?.userId !== user._id || thread.deletionTime) return null
  return thread
}

// * Queries
export const get = query({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.slugOrId === 'new') return await getEmptyThread(ctx)

    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadEdges(ctx, thread)
  },
  returns: v.union(v.object(threadReturnFields), v.null()),
})

export const getDoc = internalQuery({
  args: {
    slugOrId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)

    return thread ? thread.doc() : null
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const viewerId = ctx.viewerId
    if (!viewerId) return null

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', viewerId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadEdges(ctx, thread))

    return threads
  },
  returns: nullable(v.array(v.object(threadReturnFields))),
})

export const listMessages = query({
  args: {
    slugOrId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(v.object(messageReturnFields)) }),
})

export const getMessage = query({
  args: {
    slugOrId: v.string(),
    series: v.number(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getMessageBySeries(ctx, { threadId: thread._id, series: args.series })
  },
  returns: v.union(v.object(messageReturnFields), v.null()),
})

export const getConversation = internalQuery({
  args: {
    messageId: v.id('messages'),
    limit: v.optional(v.number()),
    prependNamesToContent: v.optional(v.boolean()),
  },
  handler: async (ctx, { messageId, limit = 20, prependNamesToContent = false }) => {
    const message = await ctx.table('messages').getX(messageId)

    const messages = await ctx
      .table('messages', 'threadId', (q) =>
        q.eq('threadId', message.threadId).lt('_creationTime', message._creationTime),
      )
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('deletionTime'), undefined), q.neq(q.field('text'), undefined)),
      )
      .take(limit)
      .map((message) => ({
        role: message.role,
        name: prependNamesToContent ? undefined : message.name,
        content:
          prependNamesToContent && message.name !== undefined
            ? `${message.name}: ${message.text}`
            : message.text || '',
      }))

    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (thread.instructions) {
      messages.push({
        role: 'system',
        content: thread.instructions.replace('{{date}}', new Date().toISOString()),
        name: undefined,
      })
    }

    return messages.reverse()
  },
})

export const getMessageCreatedBetween = query({
  args: {
    threadId: v.string(),
    before: v.number(),
    after: v.number(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.threadId)
    if (!thread) return null

    const messages = await ctx
      .table('messages', 'threadId', (q) =>
        q
          .eq('threadId', thread._id)
          .gt('_creationTime', args.after)
          .lt('_creationTime', args.before),
      )
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((message) => ({
        _id: message._id,
        _creationTime: message._creationTime,
        role: message.role,
        name: message.name,
        text: message.text,
        series: message.series,
      }))

    return messages
  },
  returns: nullable(
    v.array(
      v.object({
        _id: v.id('messages'),
        _creationTime: v.number(),
        role: literals('system', 'assistant', 'user'),
        name: v.optional(v.string()),
        text: v.optional(v.string()),
        series: v.number(),
      }),
    ),
  ),
})

// * Mutations
export const create = mutation({
  args: pick(threadFields, ['title', 'instructions', 'favorite', 'kvMetadata']),
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const slug = await generateSlug(ctx)

    const id = await ctx.table('threads').insert({
      ...args,
      updatedAtTime: Date.now(),
      userId: user._id,
      slug: await generateSlug(ctx),
    })

    return {
      id,
      slug,
    }
  },
  returns: v.object({ id: v.id('threads'), slug: v.string() }),
})

const updateArgs = v.object(partial(omit(threadFields, ['updatedAtTime'])))
export const update = mutation({
  args: {
    threadId: v.string(),
    fields: updateArgs,
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .patch({ ...args.fields, updatedAtTime: Date.now() })
  },
})

export const updateSR = internalMutation({
  args: {
    threadId: v.string(),
    fields: updateArgs,
  },
  handler: async (ctx, args) => {
    return await ctx.skipRules
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .patch({ ...args.fields, updatedAtTime: Date.now() })
  },
})

export const remove = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx
      .table('threads')
      .getX(args.threadId as Id<'threads'>)
      .delete()

    await ctx.scheduler.runAfter(0, internal.deletion.scheduleFileDeletion, {})
  },
})

// * keyword commands
const defaultConfigs = [
  {
    name: 'sound generation',
    runConfig: [
      {
        type: 'textToAudio' as const,
        resourceKey: 'elevenlabs::sound-generation',
        prompt: '',
      },
    ],
    keyword: '@sfx',
  },
]

export const matchUserCommandKeywords = async (ctx: MutationCtx, text?: string) => {
  if (!text) return null
  const user = await ctx.viewerX()
  const configs = (user.runConfigs ?? []).concat(defaultConfigs)

  const getMatch = (keyword: string) => {
    // * match + strip command keywords
    if (['/', '@'].includes(keyword.charAt(0))) {
      if (text.startsWith(`${keyword} `)) {
        return { text: text.replace(`${keyword} `, ''), keyword }
      }
    } else if (text.includes(keyword)) {
      // * keyword anywhere
      return { text, keyword }
    }

    return null
  }

  const matches = configs
    .map((conf) => {
      const match = conf.keyword ? getMatch(conf.keyword) : null
      if (match) {
        for (const c of conf.runConfig) {
          if ('prompt' in c) {
            c.prompt = `${c.prompt} ${match.text}`
          }
        }
        return conf.runConfig
      }
    })
    .filter((m) => m !== undefined)

  if (matches.length > 1) console.warn('matched multiple configs:', matches)
  return matches[0]
}

// * Thread Actions (mutations)

// * append
// * add any message to thread, optionally run with config
export const append = mutation({
  args: {
    threadId: v.optional(v.string()),
    message: v.object({
      role: literals('assistant', 'user'),
      name: v.optional(v.string()),
      text: v.optional(v.string()),
    }),
    runConfig: v.optional(runConfigV),
    ignoreKeywordCommands: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const thread = await getOrCreateUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const message = await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      ...args.message,
    })

    if (args.ignoreKeywordCommands !== true) {
      const userConfig = await matchUserCommandKeywords(ctx, args.message.text)
      if (userConfig) {
        const runConfigs = Array.isArray(userConfig) ? userConfig : [userConfig]
        return await createRun(ctx, {
          thread,
          userId: thread.userId,
          runConfigs,
        })
      }
    }

    if (args.runConfig) {
      return await createRun(ctx, { thread, userId: thread.userId, runConfigs: [args.runConfig] })
    }

    return {
      threadId: thread._id,
      slug: thread.slug,
      messageId: message._id,
      series: message.series,
    }
  },
})

// * run
// * no user message. will create asst/result message
export const run = mutation({
  args: {
    threadId: v.optional(v.string()),
    runConfig: runConfigV,
  },
  handler: async (ctx, { threadId, runConfig }) => {
    const thread = await getOrCreateUserThread(ctx, threadId)
    if (!thread) throw new ConvexError('invalid thread')

    return await createRun(ctx, { thread, userId: thread.userId, runConfigs: [runConfig] })
  },
})

// * createRun - process runConfig
const createRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfigs,
  }: { thread: EntWriter<'threads'>; userId: Id<'users'>; runConfigs: RunConfig[] },
): Promise<ThreadActionResult> => {
  const message = await createMessage(ctx, {
    threadId: thread._id,
    userId,
    role: 'assistant',
  })

  const jobIds = await asyncMap(runConfigs, async (runConfig) => {
    switch (runConfig.type) {
      case 'textToAudio':
        return createTextToAudioRun(ctx, { thread, messageId: message._id, runConfig })
      case 'chat':
        return createChatRun(ctx, { thread, messageId: message._id, runConfig })
    }
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobIds: jobIds.filter((id) => id !== undefined),
  }
}

// * Runs

// * textToAudio
const createTextToAudioRun = async (
  ctx: MutationCtx,
  {
    messageId,
    runConfig,
  }: {
    thread: Ent<'threads'>
    messageId: Id<'messages'>
    runConfig: RunConfigTextToAudio
  },
) => {
  const input = z
    .object({
      prompt: z.string().max(2048),
      duration: z.number().max(30).optional(),
    })
    .parse(runConfig)

  await ctx.scheduler.runAfter(0, internal.action.textToAudio.run, {
    messageId,
    input,
  })

  return ''
}

// * chat
const createChatRun = async (
  ctx: MutationCtx,
  {
    thread,
    messageId,
    runConfig,
  }: { thread: EntWriter<'threads'>; messageId: Id<'messages'>; runConfig: RunConfigChat },
) => {
  const chatModel = await getChatModelByResourceKey(ctx, runConfig.resourceKey)
  if (!chatModel) throw new ConvexError('invalid resourceKey')

  const input = z
    .object({
      excludeHistoryMessagesByName: z.array(z.string().max(64)).max(64).optional(),
      maxHistoryMessages: z.number().default(64),
      prependNamesToContent: z.boolean().default(false),
      stream: z.boolean().default(true),
      max_tokens: z.number().optional(),
    })
    .transform((conf) => ({
      ...conf,
      resourceKey: chatModel.resourceKey,
      type: 'chat' as const,
    }))
    .parse(runConfig)

  await ctx.scheduler.runAfter(0, internal.action.chat.run, {
    messageId,
    runConfig: input,
  })

  await thread.patch({
    latestRunConfig: input,
    updatedAtTime: Date.now(),
  })

  return ''
}
