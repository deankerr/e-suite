import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation } from '../functions'
import { insist } from '../utils'
import { jobResultSchema } from './schema'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'
import type { JobTypes } from './schema'

export const createJob = async (
  ctx: MutationCtx,
  {
    type,
    messageId,
    threadId,
  }: { type: JobTypes; messageId: Id<'messages'>; threadId: Id<'threads'> },
) => {
  const jobId = await ctx
    .table('jobs')
    .insert({ type, messageId, threadId, status: 'queued', results: [] })

  await ctx.scheduler.runAfter(0, internal.jobs.completion.chatCompletion, { jobId })
  return jobId
}

export const acquire = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.table('jobs').getX(jobId)
    insist(job.status === 'queued', 'invalid job status')

    await job.patch({ status: 'active' })
    return job
  },
})

export const results = internalMutation({
  args: {
    jobId: zid('jobs'),
    status: z.enum(['complete', 'failed']),
    results: jobResultSchema.array().min(1),
  },
  handler: async (ctx, { jobId, status, results }) => {
    const job = await ctx.table('jobs').getX(jobId)
    await job.patch({ status, results })

    for (const result of results) {
      if (result.type === 'message' && job.type === 'chat-completion') {
        await ctx.table('messages').getX(job.messageId).patch({ content: result.value })
      }
    }
  },
})
