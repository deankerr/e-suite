import { asyncMap, omit } from 'convex-helpers'
import { literals, partial } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { mutation, query } from '../functions'
import { kvListV, runConfigV, threadFields } from '../schema'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '../shared/defaults'
import {
  extractInferenceConfig,
  extractValidUrlsFromText,
  getMessageName,
  getMessageText,
} from '../shared/helpers'
import { emptyPage, generateSlug } from '../utils'
import { createJob as createJobNext } from '../workflows/jobs'
import { getMessageEdges } from './messages'
import { getChatModelByResourceKey, getImageModelByResourceKey } from './models'
import { getUser } from './users'

import type { Doc, Id } from '../_generated/dataModel'
import type {
  Ent,
  EntWriter,
  MutationCtx,
  QueryCtx,
  RunConfig,
  RunConfigChat,
  RunConfigTextToAudio,
  RunConfigTextToImage,
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

const getUserThread = async (ctx: MutationCtx, threadId: string) => {
  const user = await ctx.viewerX()
  const id = ctx.table('threads').normalizeId(threadId)
  const thread = id ? await ctx.table('threads').getX(id) : null

  if (thread?.userId !== user._id || thread.deletionTime) return null
  return thread
}

export const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

const getCurrentModel = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  const model =
    thread.inference.type === 'chat-completion'
      ? await getChatModelByResourceKey(ctx, thread.inference.resourceKey)
      : thread.inference.type === 'text-to-image'
        ? await getImageModelByResourceKey(ctx, thread.inference.resourceKey)
        : null
  return model
}

export const getThreadEdges = async (ctx: QueryCtx, thread: Ent<'threads'>) => {
  return {
    ...thread,
    user: await getUser(ctx, thread.userId),
    model: await getCurrentModel(ctx, thread),
  }
}

const getOrCreateUserThread = async (ctx: MutationCtx, threadId?: string) => {
  const user = await ctx.viewerX()

  if (threadId === undefined) {
    // * create thread
    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        slug: await generateSlug(ctx),
        updatedAtTime: Date.now(),
        inference: defaultChatInferenceConfig, // NOTE have to set this here, should be updated during run
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
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (!thread) return null

    return await getThreadEdges(ctx, thread)
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
        messages.filter((message) => message !== null).filter((message) => !message.deletionTime),
        async (message) => await getMessageEdges(ctx, message),
      )
    }

    const messages = await thread
      .edge('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
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

export const getPageMetadata = query({
  args: {
    slugOrId: v.string(),
    series: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    if (thread) {
      const threadTitle = thread.title ?? 'Untitled Thread'

      const message = args.series
        ? await getMessageBySeries(ctx, { threadId: thread._id, series: args.series })
        : null
      if (message) {
        const name = getMessageName(message)
        const text = getMessageText(message)
        if (name && text) {
          return {
            title: `${threadTitle} · ${name}: ${text}`,
            description: `${threadTitle} · ${name}: ${text}`,
          }
        }
      }

      return {
        title: threadTitle,
      }
    }
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

export const updateCurrentModel = mutation({
  args: {
    threadId: v.string(),
    type: literals('chat', 'image'),
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const model =
      args.type === 'chat'
        ? await getChatModelByResourceKey(ctx, args.resourceKey)
        : await getImageModelByResourceKey(ctx, args.resourceKey)
    if (!model) throw new ConvexError('invalid model')

    const { chatConfig, textToImageConfig } = extractInferenceConfig(thread.inference)
    if (model.type === 'chat') {
      const prev = chatConfig ?? defaultChatInferenceConfig
      await thread.patch({
        inference: {
          ...prev,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    } else {
      const prev = textToImageConfig ?? defaultImageInferenceConfig
      await thread.patch({
        inference: {
          ...prev,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    }
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
    runConfig: {
      type: 'textToAudio',
      resourceKey: 'elevenlabs::sound-generation',
      prompt: '',
    },
    keyword: '@sfx',
  },
] as const

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
        console.log('matched config keyword', match.keyword, conf.name)
        if ('prompt' in conf.runConfig) conf.runConfig.prompt = match.text
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
      const urls = extractValidUrlsFromText(message.text)
      if (urls.length > 0) {
        await createJobNext.evaluateMessageUrls(ctx, {
          urls: urls.map((url) => url.toString()),
          messageId: message._id,
        })
      }
    }

    if (args.ignoreKeywordCommands !== true) {
      const userConfig = await matchUserCommandKeywords(ctx, args.message.text)
      if (userConfig) {
        return await createRun(ctx, {
          thread,
          userId: thread.userId,
          runConfig: userConfig,
        })
      }
    }

    if (args.runConfig) {
      return await createRun(ctx, { thread, userId: thread.userId, runConfig: args.runConfig })
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

    return await createRun(ctx, { thread, userId: thread.userId, runConfig })
  },
})

// * createRun - process runConfig
const createRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfig,
  }: { thread: EntWriter<'threads'>; userId: Id<'users'>; runConfig: RunConfig },
) => {
  switch (runConfig.type) {
    case 'textToImage':
      return createTextToImageRun(ctx, { thread, userId, runConfig })
    case 'textToAudio':
      return createTextToAudioRun(ctx, { thread, userId, runConfig })
    case 'chat':
      return createChatRun(ctx, { thread, userId, runConfig })
  }
}

// * Runs
// * textToImage
const createTextToImageRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfig,
  }: {
    thread: EntWriter<'threads'>
    userId: Id<'users'>
    runConfig: RunConfigTextToImage
  },
) => {
  if (runConfig.resourceKey.includes('%%')) {
    return createDuoRun(ctx, { thread, userId, runConfig })
  }

  const imageModel = await getImageModelByResourceKey(ctx, runConfig.resourceKey)
  if (!imageModel) throw new ConvexError('invalid resourceKey')

  const maxQuantities: Record<string, number> = {
    'fal-ai/aura-flow': 2,
    'fal-ai/flux-pro': 1,
  }

  const nMax = maxQuantities[imageModel.endpointModelId] ?? 4
  const input = z
    .object({
      prompt: z.string().max(4096),
      n: z
        .number()
        .default(1)
        .transform((n) => Math.max(Math.min(n, nMax), 1)),
      width: z.number().max(2048).default(1024),
      height: z.number().max(2048).default(1024),
      size: z.enum(['portrait', 'square', 'landscape']).optional(),
    })
    .transform((vals) => {
      if (vals.size) {
        const [width, height] = imageModel.sizes[vals.size]
        return width && height
          ? {
              ...vals,
              width,
              height,
            }
          : vals
      }
      return vals
    })

    .parse(runConfig)

  const inference = {
    type: 'text-to-image' as const,
    resourceKey: imageModel.resourceKey,
    endpoint: imageModel.endpoint,
    endpointModelId: imageModel.endpointModelId,
    ...input,
  }

  const message = await createMessage(ctx, {
    threadId: thread._id,
    userId,
    contentType: 'image',
    role: 'assistant',
    inference,
    name: imageModel.name,
  })

  const jobId = await createJobNext.textToImage(ctx, {
    ...inference,
    messageId: message._id,
  })

  await thread.patch({
    inference: { ...inference, prompt: '' },
    updatedAtTime: Date.now(),
    title: thread.title ? thread.title : imageModel.name, // TODO better title creation
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}

const createDuoRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfig,
  }: { thread: EntWriter<'threads'>; userId: Id<'users'>; runConfig: RunConfigTextToImage },
) => {
  const [resourceKey1, resourceKey2] = runConfig.resourceKey.split('%%')
  if (!resourceKey1 || !resourceKey2) throw new ConvexError('invalid resourceKey')

  const imageModel1 = await getImageModelByResourceKey(ctx, resourceKey1)
  const imageModel2 = await getImageModelByResourceKey(ctx, resourceKey2)
  if (!imageModel1 || !imageModel2) throw new ConvexError('invalid resourceKey')

  const input = z
    .object({
      prompt: z.string().max(4096),
    })
    .parse(runConfig)

  const inference = {
    type: 'text-to-image' as const,
    resourceKey: imageModel1.resourceKey,
    endpoint: imageModel1.endpoint,
    endpointModelId: imageModel1.endpointModelId,
    width: 1024,
    height: 1024,
    n: 1,
    ...input,
  }

  const message = await createMessage(ctx, {
    threadId: thread._id,
    userId,
    contentType: 'image',
    role: 'assistant',
    inference,
    name: imageModel1.name,
  })

  const jobId = await createJobNext.textToImage(ctx, {
    ...inference,
    messageId: message._id,
  })

  await thread.patch({
    inference: { ...inference, prompt: '' },
    updatedAtTime: Date.now(),
    title: thread.title ? thread.title : imageModel1.name,
  })

  const inference2 = {
    type: 'text-to-image' as const,
    resourceKey: imageModel2.resourceKey,
    endpoint: imageModel2.endpoint,
    endpointModelId: imageModel2.endpointModelId,
    width: 1024,
    height: 1024,
    n: 1,
    ...input,
  }

  const jobId2 = await createJobNext.textToImage(ctx, {
    ...inference2,
    messageId: message._id,
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}

// * textToAudio
const createTextToAudioRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfig,
  }: {
    thread: Ent<'threads'>
    userId: Id<'users'>
    runConfig: RunConfigTextToAudio
  },
) => {
  const input = z
    .object({
      prompt: z.string().max(2048),
      duration: z.number().max(30).optional(),
    })
    .parse(runConfig)

  const message = await createMessage(ctx, {
    threadId: thread._id,
    userId,
    contentType: 'audio',
    role: 'assistant',
    inference: {
      type: 'sound-generation',
      resourceKey: 'elevenlabs::sound-generation', // NOTE current only this source
      endpoint: 'elevenlabs',
      endpointModelId: 'sound-generation',
      ...input,
    },
    name: 'ElevenLabs Sound Generation',
  })

  const jobId = await createJobNext.textToAudio(ctx, {
    ...input,
    messageId: message._id,
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}

// * chat
const createChatRun = async (
  ctx: MutationCtx,
  {
    thread,
    userId,
    runConfig,
  }: { thread: EntWriter<'threads'>; userId: Id<'users'>; runConfig: RunConfigChat },
) => {
  const chatModel = await getChatModelByResourceKey(ctx, runConfig.resourceKey)
  if (!chatModel) throw new ConvexError('invalid resourceKey')

  const input = z
    .object({
      excludeHistoryMessagesByName: z.array(z.string().max(64)).max(64).optional(),
      maxHistoryMessages: z.number().max(64).default(64),
      stream: z.boolean().default(true),
    })
    .parse(runConfig)

  const inference = {
    type: 'chat-completion' as const,
    resourceKey: chatModel.resourceKey,
    endpoint: chatModel.endpoint,
    endpointModelId: chatModel.endpointModelId,
    ...input,
  }

  const message = await createMessage(ctx, {
    threadId: thread._id,
    userId,
    contentType: 'text',
    role: 'assistant',
    inference,
    name: chatModel.name,
  })

  const jobId = await createJobNext.chat(ctx, {
    ...inference,
    messageId: message._id,
  })

  await thread.patch({
    inference,
    updatedAtTime: Date.now(),
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}
