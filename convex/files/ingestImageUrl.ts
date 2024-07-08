import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobs'
import { insist } from '../shared/utils'

export const claim = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.url, 'required: url', { code: 'invalid_job', fatal: true })

    return { job, url: job.url }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const { job, url } = await ctx.runMutation(internal.files.ingestImageUrl.claim, args)

    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url,
    })

    await ctx.runMutation(internal.images.createImage, {
      ...metadata,
      fileId,
      messageId: job.messageId,
      originUrl: url,
    })
    console.log('[image]', url)

    await ctx.runMutation(internal.files.ingestImageUrl.complete, {
      jobId: job._id,
    })
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    await completeJob(ctx, args)
  },
})
