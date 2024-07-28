import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { getErrorMessage } from '../shared/utils'
import { textToImageWorkflow } from './textToImage'
import { WorkflowType } from './types'

const workflows: { [K in WorkflowType['type']]: WorkflowType } = {
  textToImage: textToImageWorkflow,
}

export const startWorkflow = internalMutation({
  args: {
    workflowType: v.string(),
    input: v.any(),
  },
  handler: async (ctx, args): Promise<string> => {
    const workflow = workflows[args.workflowType as WorkflowType['type']]
    if (!workflow) {
      throw new Error(`Unknown workflow type: ${args.workflowType}`)
    }

    const jobId = await ctx.table('jobs2').insert({
      workflowType: args.workflowType,
      status: 'pending',
      currentStep: 0,
      input: args.input,
      stepResults: [],
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.workflows.engine.executeNextStep, { jobId })
    console.log('job created', args.workflowType, jobId)
    return jobId
  },
})

export const executeNextStep = internalAction({
  args: {
    jobId: v.id('jobs2'),
  },

  handler: async (ctx, { jobId }): Promise<void> => {
    const job = await ctx.runQuery(internal.workflows.jobs.get, { jobId })
    if (!job) throw new Error('job not found')

    const workflow = workflows[job.workflowType as WorkflowType['type']]
    const currentStep = workflow.steps[job.currentStep]
    if (!currentStep) {
      await ctx.runMutation(internal.workflows.jobs.updateStatus, { jobId, status: 'completed' })
      return
    }

    console.log('execute next step', job.currentStep, currentStep.name, jobId)
    try {
      const previousResults = job.stepResults.map((r) => r.result)
      const result = await currentStep.action(ctx, job.input, previousResults)
      console.log('engine step result', result)

      await ctx.runMutation(internal.workflows.jobs.addStepResult, {
        jobId,
        stepResult: {
          stepName: currentStep.name,
          status: 'completed',
          result,
          startTime: Date.now(),
          endTime: Date.now(),
          retryCount: 0,
        },
      })

      // * Schedule next step / return
      await ctx.scheduler.runAfter(0, internal.workflows.engine.executeNextStep, { jobId })
    } catch (error) {
      const retryCount = (job.stepResults[job.currentStep]?.retryCount ?? 0) + 1
      if (retryCount > currentStep.retryLimit) {
        // * max retries reached
        await ctx.runMutation(internal.workflows.jobs.updateStatus, { jobId, status: 'failed' })
      } else {
        await ctx.runMutation(internal.workflows.jobs.addStepResult, {
          jobId,
          stepResult: {
            stepName: currentStep.name,
            status: 'failed',
            error: getErrorMessage(error),
            result: undefined,
            startTime: Date.now(),
            endTime: Date.now(),
            retryCount,
          },
        })

        // * Retry after a delay
        await ctx.scheduler.runAfter(5000, internal.workflows.engine.executeNextStep, { jobId })
      }
    }
  },
})
