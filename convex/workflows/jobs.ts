import { v } from 'convex/values'

import { internalMutation, internalQuery } from '../functions'
import { job2Fields } from '../schema'

export const get = internalQuery({
  args: {
    jobId: v.id('jobs2'),
  },
  handler: async (ctx, { jobId }) => {
    return await ctx.table('jobs2').get(jobId)
  },
})

export const addStepResult = internalMutation({
  args: {
    jobId: v.id('jobs2'),
    stepResult: job2Fields.stepResults.element,
  },

  handler: async (ctx, { jobId, stepResult }) => {
    const job = await ctx.table('jobs2').getX(jobId)
    console.log('add step result', stepResult)
    try {
      return await job.patch({
        status: 'in_progress',
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

export const updateStatus = internalMutation({
  args: {
    jobId: v.id('jobs2'),
    status: v.string(),
  },
  handler: async (ctx, { jobId, status }) => {
    const job = await ctx.table('jobs2').getX(jobId)
    return await job.patch({
      status,
    })
  },
})
