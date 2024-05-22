// text-to-image
// input: target message -> inference parameters
// output: url/s -> message.files
//  -> spawn next job to ingest image
//  -> append image to target message

import { zid } from 'convex-helpers/server/zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, jobResultError, jobResultSuccess } from '../jobs/runner'
import { fal } from '../providers/fal'
import { sinkin } from '../providers/sinkin'
import { filesListSchema } from '../threads/schema'

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

export const initialize = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)
    if (!job) return null

    const message = job.messageId ? await ctx.table('messages').getX(job.messageId) : null
    const inference = message?.inference
    if (!inference || inference.type !== 'text-to-image') {
      await jobResultError(ctx, {
        jobId: job._id,
        error: {
          code: 'invalid_job',
          message: 'message missing text-to-image params',
          fatal: true,
        },
      })
      return null
    }

    return { ...message, inference }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs_beta'),
  },
  handler: async (ctx, args) => {
    try {
      const message = await ctx.runMutation(internal.inference.textToImage.initialize, {
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
      console.error(err)

      const message = err instanceof Error ? err.message : 'unknown error'
      await ctx.runMutation(internal.jobs.runner.resultError, {
        jobId: args.jobId,
        error: { code: 'unhandled', message, fatal: false },
      })

      throw err
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs_beta'),
    messageId: zid('messages'),
    files: filesListSchema,
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    const files = (message.files ?? []).concat(args.files)
    await message.patch({ files })

    // TODO queue ingest image jobs for each url
    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
