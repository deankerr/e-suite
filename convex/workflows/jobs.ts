import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { logOpsEvent } from '../db/admin/events'
import { internalMutation, internalQuery } from '../functions'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'
import type { TextToAudioPipelineInput } from './pipelines/textToAudio'

const register = async (
  ctx: MutationCtx,
  {
    pipeline,
    input,
    delay = 0,
  }: {
    pipeline: string
    input: Record<string, unknown> & {
      messageId?: Id<'messages'>
      threadId?: Id<'threads'>
      imageId?: string
    }
    delay?: number
  },
) => {
  const jobId = await ctx.table('jobs3').insert({
    status: 'pending',
    currentStep: 0,
    stepResults: [],
    updatedAt: Date.now(),
    pipeline,
    input,
    messageId: input.messageId,
    threadId: input.threadId,
    imageId: input.imageId,
  })

  await ctx.scheduler.runAfter(delay, internal.workflows.engine.executeStep, { jobId })
  return jobId
}

export const createJob = {
  textToAudio: async (ctx: MutationCtx, input: TextToAudioPipelineInput) => {
    return await register(ctx, {
      pipeline: 'textToAudio',
      input,
    })
  },
}

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
    await logOpsEvent(ctx, {
      type: 'error',
      message: `Job ${jobId} failed`,
    })
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
    console.log(`${job.pipeline}.${stepName}`)

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
      details: v.optional(v.any()),
    }),
    startTime: v.number(),
  },
  handler: async (ctx, { jobId, stepName, error, startTime }) => {
    const job = await ctx.table('jobs3').getX(jobId)
    const retryCount = (job.stepResults.at(-1)?.retryCount ?? 0) + 1
    console.warn(`${job.pipeline}.${stepName} ${error.fatal ? 'fatal' : retryCount}`, error.message)

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
