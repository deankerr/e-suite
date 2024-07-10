import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { getImageModelByResourceKey } from '../db/imageModels'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobs'
import { imageFields } from '../schema'
import { getTextToImageConfig, insist } from '../shared/utils'

import type { Ent, MutationCtx } from '../types'

export const claim = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    const { url, messageId } = job
    insist(url, 'required: url', { code: 'invalid_job', fatal: true })
    insist(messageId, 'required: messageId', {
      code: 'invalid_job',
      fatal: true,
    })

    return { job, url, messageId }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const { job, url, messageId } = await ctx.runMutation(internal.files.ingestImageUrl.claim, args)

    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url,
    })

    await ctx.runMutation(internal.files.ingestImageUrl.complete, {
      jobId: job._id,
      ...metadata,
      fileId,
      messageId,
      sourceUrl: url,
    })
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    ...imageFields,
  },
  handler: async (ctx, { jobId, ...args }) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)

    await ctx.table('images').insert({
      ...args,
      threadId: message.threadId,
      userId: message.userId,
      sourceType: message.role === 'assistant' ? 'textToImage' : 'user',
      generationData: await getGenerationData(ctx, message),
    })
    console.log('[image]', args.sourceUrl)

    if (!message.hasImageContent) {
      await message.patch({ hasImageContent: true })
    }

    await completeJob(ctx, { jobId })
  },
})

const getGenerationData = async (ctx: MutationCtx, message: Ent<'messages'>) => {
  const textToImageConfig = getTextToImageConfig(message.inference)
  if (!textToImageConfig) {
    return undefined
  }

  const model = await getImageModelByResourceKey(ctx, textToImageConfig.endpointModelId)

  return {
    prompt: textToImageConfig.prompt,
    endpointId: textToImageConfig.endpoint,
    modelId: textToImageConfig.endpointModelId,
    modelName: model?.name ?? textToImageConfig.endpointModelId,
  }
}
