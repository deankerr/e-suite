import { z } from 'zod'

import { internalMutation } from '../functions'
import { jobErrorSchema } from './betaSchemat'

import type { Id } from '../_generated/dataModel'
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

// export const acquire = internalMutation({
//   args: {
//     jobId: zid('jobs_beta'),
//   },
//   handler: async (ctx, { jobId }) => {
//     const job = await ctx.table('jobs_beta').getX(jobId)
//     if (job.status !== 'queued') {
//       console.error('tried to start job with invalid status', job)
//       return null
//     }

//     await job.patch({ status: 'active', startedTime: Date.now() })
//     return job
//   },
// })

// export const resultSuccess = internalMutation({
//   args: {
//     jobId: zid('jobs_beta'),
//   },
//   handler: async (ctx, args) => {
//     const job = await ctx.table('jobs_beta').getX(args.jobId)
//     await job.patch({ status: 'complete', endedTime: Date.now() })
//   },
// })

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
  if (job.status !== 'queued') {
    console.error('tried to start job with invalid status', job)
    return null
  }

  await job.patch({ status: 'active', startedTime: Date.now() })
  return job
}

export const resultError = internalMutation(jobResultError)
