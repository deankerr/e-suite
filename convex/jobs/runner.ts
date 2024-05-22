import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation } from '../functions'
import { insist } from '../shared/utils'
import { jobErrorSchema } from './betaSchemat'

import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'
import type { MutationCtx } from '../types'

export const processJobs = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    // check for queued jobs to start
    const jobs = await ctx.table('jobs_beta', 'status', (q) => q.eq('status', 'queued'))
    for (const job of jobs) {
      // TODO - actual job queue management. for now just start all jobs
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
  insist(job.status === 'queued', `job ${jobId} is not queued`, { code: 'invalid_job' })

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
