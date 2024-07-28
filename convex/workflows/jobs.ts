import { v } from 'convex/values'

import { internalMutation, internalQuery } from '../functions'

export const get = internalQuery({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('jobs3').get(args.jobId)
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    return await job.patch({
      status: 'completed',
    })
  },
})

export const fail = internalMutation({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    return await job.patch({
      status: 'failed',
    })
  },
})

export const stepCompleted = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    stepName: v.string(),
    result: v.any(),
    startTime: v.number(),
  },
  handler: async (ctx, { jobId, stepName, result, startTime }) => {
    const job = await ctx.table('jobs3').getX(jobId)

    return await job.patch({
      status: 'active',
      stepResults: [
        ...job.stepResults,
        {
          stepName,
          status: 'completed',
          result,
          startTime,
          endTime: Date.now(),
          retryCount: 0,
        },
      ],
      currentStep: job.currentStep + 1,
      updatedAt: Date.now(),
    })
  },
})

export const stepFailed = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    stepName: v.string(),
    error: v.object({
      code: v.string(),
      message: v.string(),
      fatal: v.boolean(),
    }),
    startTime: v.number(),
  },
  handler: async (ctx, { jobId, stepName, error, startTime }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1

    return await job.patch({
      status: 'active',
      stepResults: [
        ...job.stepResults,
        {
          stepName,
          status: 'failed',
          error,
          result: null,
          startTime,
          endTime: Date.now(),
          retryCount,
        },
      ],
      updatedAt: Date.now(),
    })
  },
})
