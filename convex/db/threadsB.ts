import { omit } from 'convex-helpers'
import { literals, partial } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { mutation, query } from '../functions'
import { createJob } from '../jobs'
import { inferenceConfigV, threadFields } from '../schema'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '../shared/defaults'
import { createError, extractValidUrlsFromText, insist } from '../shared/utils'
import { generateSlug } from '../utils'
import { getChatModelByResourceKey } from './chatModels'
import { getImageModelByResourceKey } from './imageModels'
import { getMessageCommand, getNextMessageSeries } from './messages'

import type { Id } from '../_generated/dataModel'
import type {
  ChatCompletionConfig,
  Ent,
  InferenceConfig,
  MutationCtx,
  QueryCtx,
  TextToImageConfig,
} from '../types'
import type { Infer } from 'convex/values'

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

export const create = mutation({
  args: {
    text: v.string(),
    run: v.optional(v.union(runConfigChatV, runConfigTextToImageV)),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()

    const inference = args.run
      ? args.run.type === 'chat'
        ? await getTransitionConfigChat(ctx, args.run)
        : await getTransitionConfigTextToImage(ctx, args.run)
      : undefined

    const thread = await ctx
      .table('threads')
      .insert({
        userId: user._id,
        slug: await generateSlug(ctx),
        updatedAtTime: Date.now(),
        slashCommands: [],
        inference: inference ?? defaultChatInferenceConfig,
      })
      .get()

    if (inference?.type === 'text-to-image') {
      const asstMessage = await ctx
        .table('messages')
        .insert({
          userId: user._id,
          role: 'assistant',
          threadId: thread._id,
          series: 1,
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

    const userMessage = await ctx
      .table('messages')
      .insert({
        userId: user._id,
        role: 'user',
        text: args.text,
        threadId: thread._id,
        series: 1,
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

    const asstMessage = await ctx
      .table('messages')
      .insert({
        userId: user._id,
        role: 'assistant',
        threadId: thread._id,
        series: 2,
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
          width: imageModel.sizes[args.size][0],
          height: imageModel.sizes[args.size][1],
          size: args.size,
        }
      : args.size

  return {
    type: 'text-to-image',
    endpoint: imageModel.endpoint,
    endpointModelId: imageModel.endpointModelId,
    ...size,
    ...omit(args, ['type', 'size']),
  }
}
