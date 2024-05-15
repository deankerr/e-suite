import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
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
    input,
  }: { type: JobTypes; messageId: Id<'messages'>; threadId: Id<'threads'>; input?: string },
) => {
  const jobId = await ctx
    .table('jobs')
    .insert({ type, messageId, threadId, input, status: 'queued', results: [] })

  switch (type) {
    case 'text-to-image':
      await ctx.scheduler.runAfter(0, internal.jobs.generation.textToImage, { jobId })
      break
    case 'chat-completion':
      await ctx.scheduler.runAfter(0, internal.jobs.completion.chatCompletion, { jobId })
      break
    case 'fetch-image-to-file':
      await ctx.scheduler.runAfter(0, internal.jobs.files.fetchImageToFile, { jobId })
      break
    default:
      throw new ConvexError({ message: 'invalid job type', type })
  }

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

      if (job.type === 'text-to-image' && result.type === 'url') {
        await createJob(ctx, {
          type: 'fetch-image-to-file',
          messageId: job.messageId,
          threadId: job.threadId,
          input: result.value,
        })
      }
    }
  },
})
