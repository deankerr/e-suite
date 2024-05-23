import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation } from '../functions'
import { insist } from '../shared/utils'
import { jobErrorSchema } from './betaSchemat'

import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'
import type { MutationCtx } from '../types'
import type { jobTypesEnum } from './betaSchemat'
import type { FunctionReference } from 'convex/server'

type JobRequirableFields = 'threadId' | 'messageId' | 'imageId' | 'url'
type JobDefinition = {
  handler: FunctionReference<'action', 'internal'>
  required: Partial<Record<JobRequirableFields, boolean>>
}

const jobDefinitions: Record<z.infer<typeof jobTypesEnum>, JobDefinition> = {
  'files/create-image-from-url': {
    handler: internal.files.createImageFromUrl.run,
    required: {
      url: true,
      messageId: true,
    },
  },

  'files/optimize-image': {
    handler: internal.files.optimizeImage.run,
    required: {
      imageId: true,
    },
  },

  'inference/chat-completion': {
    handler: internal.inference.chatCompletion.run,
    required: {
      messageId: true,
    },
  },

  'inference/chat-completion-stream': {
    handler: internal.inference.chatCompletionStream.run,
    required: {
      messageId: true,
    },
  },

  'inference/text-to-image': {
    handler: internal.inference.textToImage.run,
    required: {
      messageId: true,
    },
  },

  'inference/thread-title-completion': {
    handler: internal.inference.threadTitleCompletion.run,
    required: {
      threadId: true,
    },
  },
}

type JobDefinitions = typeof jobDefinitions

export const createJobBeta = async <
  T extends keyof JobDefinitions,
  A extends Partial<Record<keyof JobDefinitions[T]['required'], any>>,
>(
  ctx: MutationCtx,
  jobName: T,
  args: A,
) => {
  const jobId = await ctx.table('jobs_beta').insert({
    ...args,
    type: jobName,
    status: 'queued',
    queuedTime: Date.now(),
  })

  await ctx.scheduler.runAfter(0, internal.jobs.runner.processJobs, {})

  return jobId
}

export const processJobs = internalMutation({
  args: {},
  handler: async (ctx) => {
    // check for queued jobs to start
    const queuedJobs = await ctx.table('jobs_beta', 'status', (q) => q.eq('status', 'queued'))
    for (const job of queuedJobs) {
      // TODO - actual job queue management. for now just start all jobs
      const handler = jobDefinitions[job.type].handler
      await ctx.scheduler.runAfter(0, handler, { jobId: job._id })
    }
  },
})

export const jobResultSuccess = async (ctx: MutationCtx, args: { jobId: Id<'jobs_beta'> }) => {
  const job = await ctx.table('jobs_beta').getX(args.jobId)
  await job.patch({ status: 'complete', endedTime: Date.now() })
}

export const jobResultError = async (
  ctx: MutationCtx,
  args: { jobId: Id<'jobs_beta'>; error: z.infer<typeof jobErrorSchema> },
) => {
  const job = await ctx.table('jobs_beta').getX(args.jobId)

  const errors = job.errors ?? []
  // TODO fatal check, job retrier
  await job.patch({ status: 'failed', errors: [...errors, args.error], endedTime: Date.now() })
}

export const acquireJob = async (ctx: MutationCtx, jobId: Id<'jobs_beta'>) => {
  const job = await ctx.table('jobs_beta').getX(jobId)
  insist(job.status === 'queued', `job ${jobId} is not queued: ${job.status}`, {
    code: 'invalid_job',
  })

  await job.patch({ status: 'active', startedTime: Date.now() })
  return job
}

export const resultError = internalMutation(jobResultError)

export const handleJobError = async (
  ctx: ActionCtx,
  { err, jobId }: { err: unknown; jobId: Id<'jobs_beta'> },
) => {
  // return on known fatal errors to stop retrying job, throw otherwise
  if (err instanceof ConvexError && err.data.code && err.data.fatal !== undefined) {
    await ctx.runMutation(internal.jobs.runner.resultError, {
      jobId,
      error: { code: err.data.code, message: err.data.message, fatal: err.data.fatal },
    })

    if (err.data.fatal) return console.error(err)
    else throw err
  }

  const message = err instanceof Error ? err.message : 'unknown error'
  await ctx.runMutation(internal.jobs.runner.resultError, {
    jobId,
    error: { code: 'unhandled', message, fatal: false },
  })

  throw err
}
