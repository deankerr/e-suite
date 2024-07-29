import { ConvexError, v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { getErrorMessage } from '../shared/utils'
import { chatPipeline } from './pipelines/chat'
import { textToAudioPipeline } from './pipelines/textToAudio'
import { textToImagePipeline } from './pipelines/textToImage'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'

const pipelines = {
  chat: chatPipeline,
  textToAudio: textToAudioPipeline,
  textToImage: textToImagePipeline,
}

export const createWorkflowJob = async (
  ctx: MutationCtx,
  args: {
    pipeline: keyof typeof pipelines
    input: Record<string, unknown>
    messageId?: Id<'messages'>
    threadId?: Id<'threads'>
  },
) => {
  const pipeline = pipelines[args.pipeline as keyof typeof pipelines]
  if (!pipeline) {
    throw new ConvexError(`Unknown pipeline: ${args.pipeline}`)
  }

  const jobId = await ctx.table('jobs3').insert({
    pipeline: pipeline.name,
    status: 'pending',
    currentStep: 0,
    input: args.input,
    stepResults: [],
    updatedAt: Date.now(),
    messageId: args.messageId,
    threadId: args.threadId,
  })

  await ctx.scheduler.runAfter(0, internal.workflows.engine.executeStep, { jobId })
  console.log('job created', args.pipeline, jobId)
  return jobId
}

export const startJob = internalMutation({
  args: {
    pipeline: v.string(),
    input: v.any(),
    messageId: v.optional(v.id('messages')),
    threadId: v.optional(v.id('threads')),
  },
  handler: createWorkflowJob,
})

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
    if (!step) {
      await ctx.runMutation(internal.workflows.jobs.complete, {
        jobId,
      })
      return
    }
    const startTime = Date.now()

    try {
      const previousResults = job.stepResults.map((r) => r.result)
      // * run step
      const result = await step.action(ctx, job.input, previousResults)

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
          error: {
            code: 'job_error',
            message: getErrorMessage(err),
            fatal: false,
          },
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
