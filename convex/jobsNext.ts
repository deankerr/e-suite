import { ConvexError, v } from 'convex/values'

import { internal } from './_generated/api'
import { internalMutation } from './functions'
import { jobAttributeFields, jobErrorV } from './schema'
import { createError, insist } from './shared/utils'

import type { Id } from './_generated/dataModel'
import type { ActionCtx } from './_generated/server'
import type { MutationCtx } from './types'
import type { Infer } from 'convex/values'

const jobAttributesObject = v.object(jobAttributeFields)
export const createJob = async (
  ctx: MutationCtx,
  args: { name: string; fields: Infer<typeof jobAttributesObject> },
) => {
  // TODO job names/definitions
  const jobHandlers = {
    'inference/chat-completion-ai': internal.inference.chatCompletionAi.run,
    'files/ingestImageUrl': internal.files.ingestImageUrl.run,
    'inference/captionImage': internal.inference.captionImage.run,
    'inference/assessNsfw': internal.inference.assessNsfw.run,
    'inference/textToImageNext': internal.inference.textToImageNext.run,
  }

  const handler = jobHandlers?.[args.name as keyof typeof jobHandlers]
  if (!handler) {
    throw createError('invalid job name')
  }

  const jobId = await ctx.table('jobs').insert({
    ...args.fields,
    name: args.name,
    status: 'queued',
    queuedTime: Date.now(),
  })

  // TODO queue management
  await ctx.scheduler.runAfter(0, handler, { jobId })

  return jobId
}

export const claimJob = async (ctx: MutationCtx, args: { jobId: Id<'jobs'> }) => {
  const job = await ctx.table('jobs').getX(args.jobId)
  insist(job.status === 'queued', 'invalid claim status', {
    jobId: args.jobId,
    jobStatus: job.status,
    code: 'invalid_job',
  })

  await job.patch({ status: 'active', startedTime: Date.now() })
  return job
}

export const completeJob = async (ctx: MutationCtx, args: { jobId: Id<'jobs'> }) => {
  const job = await ctx.table('jobs').getX(args.jobId)
  await job.patch({ status: 'complete', endedTime: Date.now() })
}

export const handleJobError = async (
  ctx: ActionCtx,
  { jobId, error }: { jobId: Id<'jobs'>; error: unknown },
) => {
  if (error instanceof ConvexError) {
    const jobError = {
      code: error.data?.code ?? 'unhandled',
      message: error.message,
      fatal: error.data?.fatal ?? false,
      status: error.data?.status,
    }
    return await ctx.runMutation(internal.jobsNext.fail, { jobId, jobError })
  }

  if (error instanceof Error) {
    const jobError = {
      code: 'unhandled',
      message: error.message,
      fatal: false,
    }
    return await ctx.runMutation(internal.jobsNext.fail, { jobId, jobError })
  }

  const jobError = {
    code: 'unhandled',
    message: 'unknown error',
    fatal: false,
  }
  return await ctx.runMutation(internal.jobsNext.fail, { jobId, jobError })
}

export const fail = internalMutation({
  args: {
    jobId: v.id('jobs'),
    jobError: jobErrorV,
  },
  handler: async (ctx, { jobId, jobError }) => {
    const job = await ctx.table('jobs').getX(jobId)
    const prevErrors = job.errors ?? []

    return await job.patch({
      status: 'failed',
      endedTime: Date.now(),
      errors: [...prevErrors, jobError],
    })
  },
})

export const createJobM = internalMutation({
  args: {
    name: v.string(),
    fields: jobAttributesObject,
  },
  handler: createJob,
})
