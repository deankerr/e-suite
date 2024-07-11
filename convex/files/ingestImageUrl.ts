import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { createImage } from '../db/images'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, handleJobError } from '../jobs'
import { imageFields } from '../schema'
import { insist } from '../shared/utils'

export const start = internalMutation({
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
    try {
      const { job, url, messageId } = await ctx.runMutation(
        internal.files.ingestImageUrl.start,
        args,
      )

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
    } catch (error) {
      await handleJobError(ctx, { error, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    ...imageFields,
  },
  handler: async (ctx, { jobId, ...args }) => {
    await createImage(ctx, args)
    await completeJob(ctx, { jobId })
  },
})
