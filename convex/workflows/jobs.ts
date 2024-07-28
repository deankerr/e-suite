import { v } from 'convex/values'

import { internalMutation, internalQuery } from '../functions'
import { job3Fields } from '../schema'

export const get = internalQuery({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('jobs3').get(args.jobId)
  },
})

export const updateStatus = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    status: job3Fields.status,
  },
  handler: async (ctx, { jobId, status }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    return await job.patch({
      status,
    })
  },
})

export const addStepResult = internalMutation({
  args: {
    jobId: v.id('jobs3'),
    stepResult: job3Fields.stepResults.element,
  },

  handler: async (ctx, { jobId, stepResult }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    console.log('add step result', stepResult)
    try {
      return await job.patch({
        status: 'active',
        stepResults: [...job.stepResults, stepResult],
        currentStep: stepResult.status === 'completed' ? job.currentStep + 1 : job.currentStep,
        updatedAt: Date.now(),
      })
    } catch (err) {
      console.log(stepResult)
      throw err
    }
  },
})
