import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import * as OpenAi from '../endpoints/openai'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { createJob } from '../jobs'
import { generateSha256Hash } from '../utils'

export const getVoiceModelsHelper = () => {
  const models = OpenAi.getNormalizedVoiceModelData()
  return models
}

export const getModels = query({
  args: {},
  handler: async () => {
    return getVoiceModelsHelper()
  },
})

export const get = internalQuery({
  args: {
    speechId: z.string(),
  },
  handler: async (ctx, args) => {
    const speechId = ctx.unsafeDb.normalizeId('speech', args.speechId)
    if (!speechId) return null

    const speech = await ctx.table('speech').get(speechId)
    return speech
  },
})

export const generate = mutation({
  args: {
    messageId: z.string(),
    resourceKey: z.string(),
  },
  handler: async (ctx, args) => {
    const messageId = ctx.unsafeDb.normalizeId('messages', args.messageId)
    if (!messageId) return null
    return await createJob(ctx, 'inference/text-to-speech', {
      messageId,
      resourceKey: args.resourceKey,
    })
  },
})

export const create = internalMutation({
  args: {
    text: z.string(),
    voiceResourceKey: z.string(),
    parameters: z.any(),
    fileId: zid('_storage'),
  },
  handler: async (ctx, args) => {
    const textHash = await generateSha256Hash(args.text)

    return await ctx.table('speech').insert({
      ...args,
      parameters: args.parameters,
      textHash,
      resourceKey: args.voiceResourceKey,
    })
  },
})
