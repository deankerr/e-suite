import { v } from 'convex/values'

import { internal } from './_generated/api'
import { internalMutation } from './functions'
import { jobAttributeFields } from './schema'
import { createError, insist } from './shared/utils'

import type { Id } from './_generated/dataModel'
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
  insist(job.status === 'queued', 'invalid claim job status', {
    jobId: args.jobId,
    status: job.status,
    code: 'invalid_job',
  })

  await job.patch({ status: 'active', startedTime: Date.now() })
  return job
}

export const completeJob = async (ctx: MutationCtx, args: { jobId: Id<'jobs'> }) => {
  const job = await ctx.table('jobs').getX(args.jobId)
  await job.patch({ status: 'complete', endedTime: Date.now() })
}

export const createJobM = internalMutation({
  args: {
    name: v.string(),
    fields: jobAttributesObject,
  },
  handler: createJob,
})
