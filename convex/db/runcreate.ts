import { literals } from 'convex-helpers/validators'
import { ConvexError, v } from 'convex/values'
import { z } from 'zod'

import { mutation } from '../functions'
import { createJob } from '../jobs'
import { kvListV, runConfigV } from '../schema'
import { defaultChatInferenceConfig } from '../shared/defaults'
import { generateSlug } from '../utils'
import { getChatModelByResourceKey, getImageModelByResourceKey } from './models'

import type { Doc, Id } from '../_generated/dataModel'
import type {
  Ent,
  EntWriter,
  MutationCtx,
  RunConfig,
  RunConfigChat,
  RunConfigTextToAudio,
  RunConfigTextToImage,
} from '../types'
import type { WithoutSystemFields } from 'convex/server'

// * HELPERS
const defaultConfigs = [
  {
    name: 'sound generation',
    runConfig: {
      type: 'textToAudio',
      resourceKey: 'elevenlabs::sound-generation',
      prompt: '',
    },
    keyword: '^@sfx (.+)',
  },
] as const

export const matchUserRunConfigKeyword = async (ctx: MutationCtx, text?: string) => {
  if (!text) return null
  const user = await ctx.viewerX()
  const configs = (user.runConfigs ?? []).concat(defaultConfigs)
  // keyword is regex string
  const config = configs.find((c) => (c.keyword ? new RegExp(c.keyword).test(text) : false))
  if (!config) return null

  if ('prompt' in config.runConfig) {
    const keyword = config.keyword as string
    if (keyword.startsWith('^@')) {
      config.runConfig.prompt = text.slice(text.indexOf(' ')).trim()
    } else {
      config.runConfig.prompt = text
    }
  }

  return config
}

const getOrCreateUserThread = async (ctx: MutationCtx, threadId?: string) => {
  const user = await ctx.viewerX()

  if (threadId === undefined) {
    // * create thread
    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        slashCommands: [],
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

// * APPEND
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
  },
  handler: async (ctx, args) => {
    const thread = await getOrCreateUserThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    const message = await createMessage(ctx, {
      threadId: thread._id,
      userId: thread.userId,
      ...args.message,
      hasImageReference: false,
      contentType: 'text',
    })

    const userRunConfig = await matchUserRunConfigKeyword(ctx, args.message.text)
    if (userRunConfig) {
      return await createRun(ctx, {
        thread,
        userId: thread.userId,
        runConfig: userRunConfig.runConfig,
      })
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

// * RUN
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

// * RUNS
// * TEXT TO IMAGE
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
  const imageModel = await getImageModelByResourceKey(ctx, runConfig.resourceKey)
  if (!imageModel) throw new ConvexError('invalid resourceKey')

  const nMax = imageModel.endpointModelId === 'fal-ai/aura-flow' ? 2 : 4
  const input = z
    .object({
      prompt: z.string().max(4096),
      n: z.number().max(nMax).default(1),
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
    hasImageReference: false,
    inference,
    name: imageModel.name,
  })

  const jobId = await createJob(ctx, {
    name: 'inference/textToImage',
    fields: {
      messageId: message._id,
    },
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

// * TEXT TO AUDIO
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
    hasImageReference: false,
    inference: {
      type: 'sound-generation',
      resourceKey: 'elevenlabs::sound-generation', // NOTE current only this source
      endpoint: 'elevenlabs',
      endpointModelId: 'sound-generation',
      ...input,
    },
    name: 'ElevenLabs Sound Generation',
  })

  const jobId = await createJob(ctx, {
    name: 'inference/textToAudio',
    fields: {
      messageId: message._id,
    },
  })

  return {
    threadId: thread._id,
    slug: thread.slug,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}

// * CHAT
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
    hasImageReference: false,
    inference,
    name: chatModel.name,
  })

  const jobId = await createJob(ctx, {
    name: 'inference/chat',
    fields: {
      messageId: message._id,
    },
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
