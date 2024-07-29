import { ConvexError, v } from 'convex/values'
import * as vb from 'valibot'
import { ValiError } from 'valibot'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { getErrorMessage } from '../shared/utils'
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
      console.error(err)
      // * handle error
      const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1

      if (retryCount > step.retryLimit) {
        // * max retries reached, fail
        await ctx.runMutation(internal.workflows.jobs.fail, {
          jobId,
        })
      } else {
        // * add failed step error, retry
        await ctx.runMutation(internal.workflows.jobs.stepFailed, {
          jobId,
          stepName: step.name,
          error: getErrorDetails(err),
          startTime,
        })

        // * schedule retry after delay
        await ctx.scheduler.runAfter(
          2000 * (retryCount + 1),
          internal.workflows.engine.executeStep,
          { jobId },
        )
      }
    }
  },
})

const getErrorDetails = (err: unknown) => {
  if (err instanceof ValiError) {
    return {
      code: 'vali_error',
      message: err.message,
      details: vb.flatten(err.issues),
      fatal: true,
    }
  }

  return {
    code: 'unhandled',
    message: getErrorMessage(err),
    fatal: false,
  }
}
