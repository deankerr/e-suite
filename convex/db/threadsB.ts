import { omit } from 'convex-helpers'
import { ConvexError, v } from 'convex/values'

import { mutation } from '../functions'
import { createJob } from '../jobs'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '../shared/defaults'
import { generateSlug } from '../utils'
import { getChatModelByResourceKey } from './chatModels'
import { getImageModelByResourceKey } from './imageModels'
import { getMessageCommand, getNextMessageSeries } from './messages'
import { getThreadBySlugOrId } from './threads'

import type { ChatCompletionConfig, MutationCtx, TextToImageConfig } from '../types'
import type { Infer } from 'convex/values'

export type RunConfig = Infer<typeof runConfigV>

const runConfigChatV = v.object({
  type: v.literal('chat'),
  resourceKey: v.string(),
  excludeHistoryMessagesByName: v.optional(v.array(v.string())),
  maxHistoryMessages: v.optional(v.number()),
  stream: v.optional(v.boolean()),
})

const runConfigTextToImageV = v.object({
  type: v.literal('textToImage'),
  resourceKey: v.string(),

  prompt: v.string(),
  n: v.number(),
  size: v.union(
    v.object({
      width: v.number(),
      height: v.number(),
    }),
    v.literal('portrait'),
    v.literal('square'),
    v.literal('landscape'),
  ),
})

export const runConfigV = v.union(runConfigChatV, runConfigTextToImageV)

export const append = mutation({
  args: {
    threadId: v.optional(v.string()),
    text: v.string(),
    run: v.optional(runConfigV),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()

    const runConfig = args.run
      ? args.run.type === 'chat'
        ? await getTransitionConfigChat(ctx, args.run)
        : await getTransitionConfigTextToImage(ctx, args.run)
      : undefined

    const thread = args.threadId
      ? await getThreadBySlugOrId(ctx, args.threadId)
      : await ctx
          .table('threads')
          .insert({
            userId: user._id,
            slug: await generateSlug(ctx),
            updatedAtTime: Date.now(),
            slashCommands: [],
            inference: runConfig ?? defaultChatInferenceConfig,
          })
          .get()

    if (!thread) throw new ConvexError('invalid thread')

    // update inference config if was existing thread
    if (args.threadId && runConfig) {
      await ctx.table('threads').getX(thread._id).patch({
        inference: runConfig,
      })
    }

    const messageCommand = getMessageCommand(thread, args.text)
    const inference = messageCommand?.inference ?? runConfig

    let nextSeries = await getNextMessageSeries(thread)

    // * textToImage
    if (inference?.type === 'text-to-image') {
      const asstMessage = await ctx
        .table('messages')
        .insert({
          userId: user._id,
          role: 'assistant',
          threadId: thread._id,
          series: nextSeries++,
          inference,
          contentType: 'image',
          hasImageReference: false,
        })
        .get()

      const jobId = await createJob(ctx, {
        name: 'inference/textToImage',
        fields: {
          messageId: asstMessage._id,
        },
      })

      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: asstMessage._id,
        series: asstMessage.series,
        jobId,
      }
    }

    // * textToAudio
    if (inference?.type === 'sound-generation') {
      const asstMessage = await ctx
        .table('messages')
        .insert({
          userId: user._id,
          role: 'assistant',
          threadId: thread._id,
          series: nextSeries++,
          inference,
          contentType: 'audio',
          hasImageReference: false,
        })
        .get()

      const jobId = await createJob(ctx, {
        name: 'inference/textToAudio',
        fields: {
          messageId: asstMessage._id,
        },
      })

      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: asstMessage._id,
        series: asstMessage.series,
        jobId,
      }
    }

    // * add user message
    const userMessage = await ctx
      .table('messages')
      .insert({
        userId: user._id,
        role: 'user',
        text: args.text,
        threadId: thread._id,
        series: nextSeries++,
        contentType: 'text',
        hasImageReference: false,
      })
      .get()

    if (!inference) {
      return {
        threadId: thread._id,
        slug: thread.slug,
        messageId: userMessage._id,
        series: userMessage.series,
      }
    }

    // * chat
    const asstMessage = await ctx
      .table('messages')
      .insert({
        userId: user._id,
        role: 'assistant',
        threadId: thread._id,
        series: nextSeries++,
        inference,
        contentType: 'text',
        hasImageReference: false,
      })
      .get()

    const jobId = await createJob(ctx, {
      name: 'inference/chat',
      fields: {
        messageId: asstMessage._id,
      },
    })

    return {
      threadId: thread._id,
      slug: thread.slug,
      messageId: asstMessage._id,
      series: asstMessage.series,
      jobId,
    }
  },
})

export const updateRunConfig = mutation({
  args: {
    threadId: v.string(),
    runConfig: runConfigV,
  },
  handler: async (ctx, args) => {
    const threadId = ctx.table('threads').normalizeId(args.threadId)
    if (!threadId) throw new ConvexError('invalid thread')

    const inference =
      args.runConfig.type === 'chat'
        ? await getTransitionConfigChat(ctx, args.runConfig)
        : await getTransitionConfigTextToImage(ctx, args.runConfig)

    await ctx.table('threads').getX(threadId).patch({
      inference,
    })
  },
})

export const updateRunConfigModel = mutation({
  args: {
    threadId: v.string(),
    type: v.union(v.literal('chat'), v.literal('textToImage')),
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    const threadId = ctx.table('threads').normalizeId(args.threadId)
    if (!threadId) throw new ConvexError('invalid thread')
    const thread = await ctx.table('threads').getX(threadId)

    const model =
      args.type === 'chat'
        ? await getChatModelByResourceKey(ctx, args.resourceKey)
        : await getImageModelByResourceKey(ctx, args.resourceKey)
    if (!model) throw new ConvexError('invalid model')

    if (model.type === 'chat') {
      const currentConfig =
        thread.inference.type === 'chat-completion' ? thread.inference : defaultChatInferenceConfig
      await thread.patch({
        inference: {
          ...currentConfig,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    }

    if (model.type === 'image') {
      const currentConfig =
        thread.inference.type === 'text-to-image' ? thread.inference : defaultImageInferenceConfig
      await thread.patch({
        inference: {
          ...currentConfig,
          endpoint: model.endpoint,
          endpointModelId: model.endpointModelId,
          resourceKey: model.resourceKey,
        },
      })
    }
  },
})

const getTransitionConfigChat = async (
  ctx: MutationCtx,
  args: Infer<typeof runConfigChatV>,
): Promise<ChatCompletionConfig> => {
  const chatModel = await getChatModelByResourceKey(ctx, args.resourceKey)

  if (!chatModel) return defaultChatInferenceConfig
  return {
    type: 'chat-completion',
    endpoint: chatModel.endpoint,
    endpointModelId: chatModel.endpointModelId,
    ...omit(args, ['type']),
  }
}

const getTransitionConfigTextToImage = async (
  ctx: MutationCtx,
  args: Infer<typeof runConfigTextToImageV>,
): Promise<TextToImageConfig> => {
  const imageModel = await getImageModelByResourceKey(ctx, args.resourceKey)
  if (!imageModel) return defaultImageInferenceConfig

  const size =
    typeof args.size === 'string'
      ? {
          width: imageModel.sizes[args.size][0] ?? 512,
          height: imageModel.sizes[args.size][1] ?? 512,
          size: args.size,
        }
      : args.size

  return {
    type: 'text-to-image',
    endpoint: imageModel.endpoint,
    endpointModelId: imageModel.endpointModelId,
    ...omit(args, ['type', 'size']),
    ...size,
  }
}
