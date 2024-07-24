import { ConvexError, v } from 'convex/values'
import { z } from 'zod'
import { errorMap } from 'zod-validation-error'

import { mutation } from '../functions'
import { createJob } from '../jobs'
import { inferenceConfigV } from '../schema'
import { getImageModelByResourceKey } from './models'

import type { Doc, Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'
import type { WithoutSystemFields } from 'convex/server'
import type { Infer } from 'convex/values'

// * VALIDATORS
export type RunConfig = Infer<typeof runConfigV>
export type RunConfigTextToImage = Infer<typeof runConfigTextToImageV>

export const runConfigChatV = v.object({
  type: v.literal('chat'),
  resourceKey: v.string(),
  excludeHistoryMessagesByName: v.optional(v.array(v.string())),
  maxHistoryMessages: v.optional(v.number()),
  stream: v.optional(v.boolean()),
})

export const runConfigTextToImageV = v.object({
  type: v.literal('textToImage'),
  resourceKey: v.string(),

  prompt: v.string(),
  n: v.optional(v.number()),
  size: v.optional(v.union(v.literal('portrait'), v.literal('square'), v.literal('landscape'))),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
})

export const runConfigTextToAudioV = v.object({
  type: v.literal('textToAudio'),
  resourceKey: v.string(),
  prompt: v.string(),
})

export const runConfigV = v.union(runConfigChatV, runConfigTextToImageV, runConfigTextToAudioV)

// * HELPERS
const getThread = async (ctx: MutationCtx, threadId: string) => {
  const id = ctx.table('threads').normalizeId(threadId)
  return id ? await ctx.table('threads').get(id) : null
}

const createMessage = async (
  ctx: MutationCtx,
  fields: Omit<WithoutSystemFields<Doc<'messages'>>, 'series'>,
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

// * RUN
// * no user message. will create asst/result message
export const run = mutation({
  args: {
    threadId: v.string(),
    runConfig: runConfigV,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const thread = await getThread(ctx, args.threadId)
    if (!thread) throw new ConvexError('invalid thread')

    if (args.runConfig.type === 'textToImage') {
      return createTextToImageRun(ctx, {
        threadId: thread._id,
        userId: user._id,
        runConfig: args.runConfig,
      })
    }

    throw new Error('unimplemented')
    // create message
    // const message = await createMessage(ctx, {
    //   threadId: thread._id,
    //   userId: user._id,
    //   contentType: 'text', // TODO
    //   role: 'assistant',
    //   hasImageReference: false,
    //   inference: args.runConfig
    // })
  },
})

// * RUNS
// * TEXT TO IMAGE
const createTextToImageRun = async (
  ctx: MutationCtx,
  {
    threadId,
    userId,
    runConfig,
  }: {
    threadId: Id<'threads'>
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
    .transform((vals) =>
      vals.size
        ? {
            ...vals,
            width: imageModel.sizes[vals.size][0],
            height: imageModel.sizes[vals.size][1],
          }
        : vals,
    )
    .parse(runConfig)

  const message = await createMessage(ctx, {
    threadId,
    userId,
    contentType: 'image',
    role: 'assistant',
    hasImageReference: false,
    inference: {
      type: 'text-to-image',
      resourceKey: imageModel.resourceKey,
      endpoint: imageModel.endpoint,
      endpointModelId: imageModel.endpointModelId,
      ...input,
    },
    name: imageModel.name,
    text: runConfig.prompt,
  })

  const jobId = await createJob(ctx, {
    name: 'inference/textToImage',
    fields: {
      messageId: message._id,
    },
  })

  return {
    threadId,
    messageId: message._id,
    series: message.series,
    jobId,
  }
}
