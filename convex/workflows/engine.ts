import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { stringifyValueForError } from '../shared/utils'
import { WorkflowError } from './helpers'
import { textToAudioPipeline } from './pipelines/textToAudio'

import type { Doc } from '../_generated/dataModel'

const pipelines = {
  textToAudio: textToAudioPipeline,
}

export const executeStep = internalAction({
  args: {
    jobId: v.id('jobs3'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.runQuery(internal.workflows.jobs.get, { jobId })
    if (!job) {
      throw new ConvexError({ message: 'invalid job id', code: 'invalid_job', jobId })
    }

    const pipeline = pipelines[job.pipeline as keyof typeof pipelines]
    if (!pipeline)
      throw new ConvexError({
        message: 'invalid pipeline',
        code: 'invalid_job',
        pipeline,
        job: job as Doc<'jobs3'>,
      })

    const step = pipeline.steps[job.currentStep]
    // * no step - assume job finished
    // ? could add a 'final result' to output field here
    if (!step) {
      await ctx.runMutation(internal.workflows.jobs.complete, {
        jobId,
      })
      return
    }
    const startTime = Date.now()

    try {
      // * step input/results record
      const stepInput = Object.fromEntries([
        ['initial', job.input],
        ...job.stepResults.map((sr) => [sr.stepName, sr.result]),
      ])
      // * run step
      const result = await step.action(ctx, stepInput)

      // * add successful result
      await ctx.runMutation(internal.workflows.jobs.stepCompleted, {
        jobId,
        stepName: step.name,
        result,
        startTime,
      })

      // * schedule next step
      await ctx.scheduler.runAfter(0, internal.workflows.engine.executeStep, { jobId })
    } catch (err) {
      // * handle error
      if (err instanceof WorkflowError) {
        // * add failed step error
        await ctx.runMutation(internal.workflows.jobs.stepFailed, {
          jobId,
          stepName: step.name,
          error: {
            code: err.code,
            message: err.message,
            fatal: err.fatal,
            details: stringifyValueForError(err.details),
          },
          startTime,
        })

        if (err.fatal) {
          // * fatal error, terminate job
          console.error(job.pipeline, 'fatal')
          await ctx.runMutation(internal.workflows.jobs.fail, {
            jobId,
          })
          return
        }

        const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1
        if (retryCount > step.retryLimit) {
          // * max retries reached, fail
          console.error(job.pipeline, 'max retries reached')
          await ctx.runMutation(internal.workflows.jobs.fail, {
            jobId,
          })
          return
        }

        // * schedule retry after delay
        await ctx.scheduler.runAfter(
          2000 * (retryCount + 1),
          internal.workflows.engine.executeStep,
          { jobId },
        )
        return
      }

      console.error('failed to handle workflow error', err)
      await ctx.runMutation(internal.workflows.jobs.fail, {
        jobId,
      })
    }
  },
})
