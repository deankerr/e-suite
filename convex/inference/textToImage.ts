// text-to-image
// input: target message -> inference parameters
// output: url/s -> message.files
//  -> spawn next job to ingest image
//  -> append image to target message

import { zid } from 'convex-helpers/server/zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs/runner'
import { fal } from '../providers/fal'
import { sinkin } from '../providers/sinkin'
import { insist } from '../shared/utils'
import { messageFileSchema } from '../threads/schema'

import type { Id } from '../_generated/dataModel'
import type { GenerationParameters } from '../threads/schema'
import type { MutationCtx } from '../types'

export const createTextToImageJob = async (
  ctx: MutationCtx,
  args: {
    messageId: Id<'messages'>
  },
) => {
  return await ctx.table('jobs_beta').insert({
    type: 'inference/text-to-image',
    status: 'queued',
    messageId: args.messageId,
    queuedTime: Date.now(),
  })
}

export const init = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })

    const message = await ctx.table('messages').getX(messageId)
    const inference = message?.inference
    insist(
      inference && inference.type === 'text-to-image',
      'text-to-image message lacks parameters',
      {
        code: 'invalid_job_input',
      },
    )

    return { ...message, inference }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    try {
      const message = await ctx.runMutation(internal.inference.textToImage.init, {
        jobId: args.jobId,
      })
      if (!message) return

      const { endpoint, parameters } = message.inference

      const { result, error } =
        endpoint === 'sinkin'
          ? await sinkin.textToImage({
              parameters: parameters as GenerationParameters,
              n: parameters.n,
            })
          : await fal.textToImage({
              parameters: parameters as GenerationParameters,
              n: parameters.n,
            })

      if (error) {
        await ctx.runMutation(internal.jobs.runner.resultError, {
          jobId: args.jobId,
          error: { code: 'endpoint_error', message: error.message, fatal: true },
        })
        return
      }

      await ctx.runMutation(internal.inference.textToImage.complete, {
        jobId: args.jobId,
        messageId: message._id,
        files: result.urls.map((url) => ({ type: 'image_url' as const, url })),
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
    messageId: zid('messages'),
    files: messageFileSchema.array(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    const files = (message.files ?? []).concat(args.files)
    await message.patch({ files })

    // TODO queue ingest image jobs for each url
    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
