import { makeFunctionReference } from 'convex/server'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation } from '../functions'
import { insist } from '../shared/utils'
import { jobDefinitions } from './definitions'

import type { Id } from '../_generated/dataModel'
import type { ActionCtx } from '../_generated/server'
import type { MutationCtx } from '../types'
import type { JobNames } from './definitions'
import type { jobErrorSchema } from './schema'

export const createJob = async (ctx: MutationCtx, name: JobNames, args: Record<string, any>) => {
  const jobId = await ctx
    .table('jobs')
    .insert({ ...args, name, status: 'queued', queuedTime: Date.now() })

  await ctx.scheduler.runAfter(0, internal.jobs.runner.processJobs, {})
  return jobId
}

export const acquireJob = async (ctx: MutationCtx, jobId: Id<'jobs'>) => {
  const job = await ctx.table('jobs').getX(jobId)
  insist(job.status === 'queued', `job ${jobId} is not queued: ${job.status}`, {
    code: 'invalid_acquire_job',
  })

  await job.patch({ status: 'active', startedTime: Date.now() })
  return job
}

export const jobResultSuccess = async (ctx: MutationCtx, args: { jobId: Id<'jobs'> }) => {
  const job = await ctx.table('jobs').getX(args.jobId)
  await job.patch({ status: 'complete', endedTime: Date.now() })
}

export const jobResultError = async (
  ctx: MutationCtx,
  args: { jobId: Id<'jobs'>; error: z.infer<typeof jobErrorSchema> },
) => {
  const job = await ctx.table('jobs').getX(args.jobId)

  const errors = job.errors ?? []
  // TODO fatal check, job retrier
  await job.patch({ status: 'failed', errors: [...errors, args.error], endedTime: Date.now() })
}

export const handleJobError = async (
  ctx: ActionCtx,
  { err, jobId }: { err: unknown; jobId: Id<'jobs'> },
) => {
  // return on known fatal errors to stop retrying job, throw otherwise
  if (err instanceof ConvexError && err.data.code) {
    if (err.data.code === 'invalid_acquire_job') return console.warn(err.message)

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

export const processJobs = internalMutation({
  args: {},
  handler: async (ctx) => {
    // check for queued jobs to start
    const queuedJobs = await ctx.table('jobs', 'status', (q) => q.eq('status', 'queued'))
    for (const job of queuedJobs) {
      // TODO - actual job queue management. for now just start all jobs
      const handler = makeFunctionReference<'action'>(getJobDefinition(job.name).handler)
      await ctx.scheduler.runAfter(0, handler, { jobId: job._id })
    }
  },
})

export const resultError = internalMutation(jobResultError)

const getJobDefinition = (jobName: string) => {
  const jobDefinition = jobDefinitions[jobName as JobNames]
  if (!jobDefinition) throw new ConvexError({ message: 'invalid job name', jobName })
  return jobDefinition
}
