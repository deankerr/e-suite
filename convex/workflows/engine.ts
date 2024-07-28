import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { getErrorMessage } from '../shared/utils'
import { textToImagePipeline } from './pipelines/textToImage'

const pipelines = {
  textToImage: textToImagePipeline,
}

export const startJob = internalMutation({
  args: {
    pipeline: v.string(),
    input: v.any(),
  },
  handler: async (ctx, args) => {
    const pipeline = pipelines[args.pipeline as keyof typeof pipelines]
    if (!pipeline) {
      throw new Error(`Unknown pipeline: ${args.pipeline}`)
    }

    const jobId = await ctx.table('jobs3').insert({
      pipeline: args.pipeline,
      status: 'pending',
      currentStep: 0,
      input: args.input,
      stepResults: [],
      updatedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.workflows.engine.executeStep, { jobId })
    console.log('job created', args.pipeline, jobId)
    return jobId
  },
})

export const executeStep = internalAction({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runQuery(internal.workflows.jobs.get, { jobId })
    if (!job) {
      throw new Error('job not found')
    }

    const pipeline = pipelines[job.pipeline as keyof typeof pipelines]
    const step = pipeline.steps[job.currentStep]
    // * no step - assume job finished
    if (!step) {
      await ctx.runMutation(internal.workflows.jobs.updateStatus, {
        jobId,
        status: 'completed',
      })
      return
    }

    const stepStartTime = Date.now()
    try {
      // * run step
      const previousResults = job.stepResults.map((r) => r.result)
      const result = await step.action(ctx, job.input, previousResults)

      // * add successful result
      await ctx.runMutation(internal.workflows.jobs.addStepResult, {
        jobId,
        stepResult: {
          stepName: step.name,
          status: 'completed',
          result,
          startTime: stepStartTime,
          endTime: Date.now(),
          retryCount: 0,
        },
      })

      // * schedule next step, return
      await ctx.scheduler.runAfter(0, internal.workflows.engine.executeStep, { jobId })
    } catch (err) {
      const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1

      if (retryCount > step.retryLimit) {
        // * max retries reached, fail
        await ctx.runMutation(internal.workflows.jobs.updateStatus, {
          jobId,
          status: 'failed',
        })
      } else {
        // * add failed step error, retry
        await ctx.runMutation(internal.workflows.jobs.addStepResult, {
          jobId,
          stepResult: {
            stepName: step.name,
            status: 'failed',
            error: {
              code: 'job_error',
              message: getErrorMessage(err),
              fatal: false,
            },
            result: null,
            startTime: stepStartTime,
            endTime: Date.now(),
            retryCount,
          },
        })

        // * Retry after a delay
        await ctx.scheduler.runAfter(
          2000 * (retryCount + 1),
          internal.workflows.engine.executeStep,
          { jobId },
        )
      }
    }
  },
})
