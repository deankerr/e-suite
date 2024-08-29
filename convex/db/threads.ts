import { asyncMap, omit, pruneNull } from 'convex-helpers'
import { literals, partial } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { ENV } from '../lib/env'
import { emptyPage, generateSlug } from '../lib/utils'
import { kvListV, runConfigV, threadFields } from '../schema'
import { extractValidUrlsFromText } from '../shared/helpers'
import { imageModels } from '../shared/imageModels'
import { createJob as createJobNext } from '../workflows/jobs'
import { createGeneration } from './generations'
import { getImageEdges, getImageWithEdges } from './images'
import { createEvaluateMessageUrlsJob } from './jobs'
import { getMessageEdges } from './messages'
import { getChatModelByResourceKey } from './models'
import { getUserIsViewer, getUserPublic } from './users'

import type { Doc, Id } from '../_generated/dataModel'
import type {
  Ent,
  EntWriter,
  EThread,
  MutationCtx,
  QueryCtx,
  RunConfig,
  RunConfigChat,
  RunConfigTextToAudio,
  RunConfigTextToImage,
  ThreadActionResult,
} from '../types'
import type { WithoutSystemFields } from 'convex/server'

// * Helpers
const createMessage = async (
  ctx: MutationCtx,
  fields: Omit<WithoutSystemFields<Doc<'messages'>>, 'series' | 'deletionTime'>,
) => {
  const prev = await ctx
    .table('threads')
    .getX(fields.threadId)
    .edge('messages')
    .order('desc')
    .first()
  const series = prev ? prev.series + 1 : 1

  const message = await ctx
    .table('messages')
    .insert({ ...fields, series })
    .get()
  return message
}

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
    _id: 'new',
    slug: 'new',
    title: 'New Thread',
    _creationTime: Date.now(),
    updatedAtTime: Date.now(),
    userId: user._id,
    userIsViewer: true,
    user,
  }
}

const getOrCreateUserThread = async (ctx: MutationCtx, threadId?: string) => {
  const user = await ctx.viewerX()

  if (threadId === undefined || threadId === 'new') {
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
    const userId = ctx.viewerId
    if (!userId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(async (thread) => await getThreadEdges(ctx, thread))

    return threads
  },
})

export const latestMessages = query({
  args: {
    slugOrId: v.string(),
    limit: v.number(),
    byMediaType: v.optional(literals('images', 'audio')),
    role: v.optional(literals('assistant', 'user')),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return []

    if (args.byMediaType) {
      const messageIdsAll = await thread
        .edge(args.byMediaType)
        .order('desc')
        .filter((q) => q.eq(q.field('deletionTime'), undefined))
        .take(args.limit)
        .map(async (media) => media.messageId)

      const messageIds = [...new Set(messageIdsAll)]

      const messages = await ctx.table('messages').getMany(messageIds)

      return await asyncMap(
        messages
          .filter((message) => message !== null)
          .filter((message) =>
            !message.deletionTime && args.role ? message.role === args.role : true,
          ),
        async (message) => await getMessageEdges(ctx, message),
      )
    }

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          args.role ? q.eq(q.field('role'), args.role) : true,
        ),
      )
      .take(args.limit)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
})

export const listMessages = query({
  args: {
    slugOrId: v.string(),
    paginationOpts: paginationOptsValidator,
    byMediaType: v.optional(literals('images', 'audio')),
    role: v.optional(literals('assistant', 'user')),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    if (args.byMediaType) {
      const messages = await thread
        .edge(args.byMediaType)
        .order('desc')
        .filter((q) => q.eq(q.field('deletionTime'), undefined))
        .paginate(args.paginationOpts)
        .map(
          async (media) =>
            await media
              .edgeX('message')
              .then(async (message) => await getMessageEdges(ctx, message)),
        )

      const uniqueIds = new Set(messages.page.map((m) => m._id))
      const page = [...uniqueIds].map((id) =>
        messages.page.find((m) => m._id === id),
      ) as (typeof messages)['page']

      return { ...messages, page: args.role ? page.filter((m) => m.role === args.role) : page }
    }

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          args.role ? q.eq(q.field('role'), args.role) : true,
        ),
      )
      .paginate(args.paginationOpts)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
})

export const listImages = query({
  args: {
    slugOrId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    const images = await thread
      .edge('images_v1')
      .order('desc')
      .paginate(args.paginationOpts)
      .map(async (image) => await getImageEdges(ctx, image))

    return {
      ...images,
      page: images.page.filter((image) => !image.deletionTime),
    }
  },
})

export const searchImages = query({
  args: {
    slugOrId: v.string(),
    query: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return emptyPage()

    const results = await ctx
      .table('images_search_text')
      .search('text', (q) => q.search('text', args.query))
      .paginate(args.paginationOpts)
      .map(async ({ imageId }) => {
        if (await thread.edge('images_v1').has(imageId)) {
          return await getImageWithEdges(ctx, imageId)
        }
        return null
      })

    return {
      ...results,
      page: pruneNull(results.page),
    }
  },
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
})

export const getConversation = internalQuery({
  args: {
    messageId: v.id('messages'),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, limit = 20 }) => {
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
        name: message.name,
        content: message.text || '',
      }))

    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (thread.instructions) {
      messages.push({
        role: 'system',
        content: thread.instructions,
        name: undefined,
      })
    }

    return messages.reverse()
  },
})

// * Mutations
const updateArgs = v.object(partial(omit(threadFields, ['updatedAtTime', 'metadata'])))
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
      metadata: v.optional(kvListV),
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
      contentType: 'text',
    })

    if (message.text) {
      const urls = extractValidUrlsFromText(message.text).filter(
        (url) => url.hostname !== ENV.APP_HOSTNAME,
      )
      if (urls.length > 0) {
        await createEvaluateMessageUrlsJob(ctx, {
          urls: urls.map((url) => url.toString()),
          messageId: message._id,
        })
      }
    }

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
    contentType: 'text',
    role: 'assistant',
  })

  const jobIds = await asyncMap(runConfigs, async (runConfig) => {
    switch (runConfig.type) {
      case 'textToImage':
        return createTextToImageRun(ctx, { thread, messageId: message._id, runConfig, userId })
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
    jobIds,
  }
}

// * Runs
// * textToImage
const createTextToImageRun = async (
  ctx: MutationCtx,
  {
    thread,
    messageId,
    runConfig,
    userId,
  }: {
    thread: EntWriter<'threads'>
    messageId: Id<'messages'>
    userId: Id<'users'>
    runConfig: RunConfigTextToImage
  },
) => {
  const imageModel = imageModels.find((m) => m.modelId === runConfig.modelId)
  if (!imageModel) throw new ConvexError('invalid modelId')

  const nMax = imageModel.inputs.maxQuantity
  const input = z
    .object({
      prompt: z.string().max(4096),
      negativePrompt: z.string().max(4096).optional(),
      n: z
        .number()
        .default(1)
        .transform((n) => Math.max(Math.min(n, nMax), 1)),
      width: z.number().max(2048).optional(),
      height: z.number().max(2048).optional(),
      size: z.enum(['portrait', 'square', 'landscape']).optional(),
      seed: z.number().optional(),
      loras: z
        .array(
          z.object({
            path: z.string(),
            scale: z.number().optional(),
          }),
        )
        .optional(),
      workflow: z.string().optional(),
    })
    .transform((vals) => {
      if (vals.size && !(vals.width && vals.height)) {
        const size = imageModel.inputs.sizes.find((s) => s.name === vals.size)
        return {
          ...vals,
          width: size?.width,
          height: size?.height,
        }
      }
      return vals
    })
    .transform((conf) => ({
      ...conf,
      modelId: imageModel.modelId,
      type: 'textToImage' as const,
    }))

    .parse(runConfig)

  const jobId = await createGeneration(ctx, {
    input,
    messageId,
    threadId: thread._id,
    userId,
  })

  await thread.patch({
    latestRunConfig: input,
    updatedAtTime: Date.now(),
    title: thread.title ? thread.title : imageModel.name, // TODO better title creation
  })

  return jobId
}

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

  const jobId = await createJobNext.textToAudio(ctx, {
    ...input,
    messageId,
  })

  return jobId
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
      maxHistoryMessages: z.number().max(64).default(64),
      stream: z.boolean().default(true),
      max_tokens: z.number().optional(),
    })
    .transform((conf) => ({
      ...conf,
      resourceKey: chatModel.resourceKey,
      type: 'chat' as const,
    }))
    .parse(runConfig)

  // const jobId = await createJobNext.chat(ctx, {
  //   ...input,
  //   messageId,
  // })
  await ctx.scheduler.runAfter(0, internal.action.chat.run, {
    messageId,
    runConfig: input,
  })

  await thread.patch({
    latestRunConfig: input,
    updatedAtTime: Date.now(),
  })

  return '' as Id<'jobs3'>
}
