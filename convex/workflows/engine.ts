import { ConvexError, v } from 'convex/values'
import * as vb from 'valibot'
import { ValiError } from 'valibot'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { chatPipeline } from './pipelines/chat'
import { evaluateMessageUrlsPipeline } from './pipelines/evaluateMessageUrls'
import { generateThreadTitlePipeline } from './pipelines/generateThreadTitle'
import { ingestImageUrlPipeline } from './pipelines/ingestImageUrl'
import { textToAudioPipeline } from './pipelines/textToAudio'
import { textToImagePipeline } from './pipelines/textToImage'

const pipelines = {
  chat: chatPipeline,
  evaluateMessageUrls: evaluateMessageUrlsPipeline,
  generateThreadTitle: generateThreadTitlePipeline,
  ingestImageUrl: ingestImageUrlPipeline,
  textToAudio: textToAudioPipeline,
  textToImage: textToImagePipeline,
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
            details: err.details,
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

export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly fatal: boolean = false,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'WorkflowError'
  }
}

export async function jobErrorHandling<T>(fn: () => Promise<T>, stepName: string): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof WorkflowError) {
      throw error
    } else if (error instanceof ConvexError) {
      // TODO remove ConvexErrors from jobs
      const { code, details } = error.data as { code: string; details?: any }
      throw new WorkflowError(error.message, code, true, details)
    } else if (error instanceof ValiError) {
      throw new WorkflowError(error.message, 'validation_error', true, vb.flatten(error.issues))
    } else {
      console.error(`Error in step ${stepName}:`, error)
      throw new WorkflowError(`Unexpected error in step ${stepName}`, 'unexpected_error', false, {
        originalError: error,
      })
    }
  }
}
