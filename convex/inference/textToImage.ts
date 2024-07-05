import { v } from 'convex/values'

import { internal } from '../_generated/api'
import * as fal from '../endpoints/fal'
import * as sinkin from '../endpoints/sinkin'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, createJob, handleJobError } from '../jobs'
import { getTextToImageConfig, insist } from '../shared/utils'

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.messageId, 'required: messageId', { code: 'invalid_job' })

    const message = await ctx.table('messages').getX(job.messageId)
    const textToImageConfig = getTextToImageConfig(message?.inference)
    insist(textToImageConfig, 'required: text-to-image config', {
      code: 'invalid_job',
    })

    return {
      job,
      messageId: message._id,
      textToImageConfig,
    }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const { job, messageId, textToImageConfig } = await ctx.runMutation(
        internal.inference.textToImage.start,
        args,
      )

      const endpointHandlers = {
        fal: fal.textToImage,
        sinkin: sinkin.textToImage,
      }
      const handler = endpointHandlers[textToImageConfig.endpoint as keyof typeof endpointHandlers]
      if (!handler) {
        await ctx.runMutation(internal.jobs.fail, {
          jobId: job._id,
          jobError: {
            message: `unknown endpoint: ${textToImageConfig.endpoint}`,
            code: 'invalid_job',
            fatal: true,
          },
        })
        return
      }

      const result = await handler({
        textToImageConfig,
      })

      if (result.error) {
        await ctx.runMutation(internal.jobs.fail, {
          jobId: job._id,
          jobError: result.error,
        })
        return
      }

      await ctx.runMutation(internal.inference.textToImage.complete, {
        jobId: job._id,
        messageId,
        images: result.images,
      })
    } catch (error) {
      await handleJobError(ctx, { jobId: args.jobId, error })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    images: v.array(
      v.object({
        url: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const image of args.images) {
      await createJob(ctx, {
        name: 'files/ingestImageUrl',
        fields: {
          url: image.url,
          messageId: args.messageId,
        },
      })
    }

    await completeJob(ctx, args)
  },
})
