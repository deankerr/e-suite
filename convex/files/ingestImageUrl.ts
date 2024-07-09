import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobs'
import { imageFields } from '../schema'
import { insist } from '../shared/utils'

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
    })
    console.log('[image]', args.sourceUrl)

    await completeJob(ctx, { jobId })
  },
})
