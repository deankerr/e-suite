import { pick } from 'convex-helpers'
import { v } from 'convex/values'
import { ms } from 'itty-time'

import { internal } from '../_generated/api'
import { internalMutation, query } from '../functions'
import { getThreadBySlugOrId } from './threads'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'

export const get = query({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await getThreadBySlugOrId(ctx, args.threadId)
    if (!thread) {
      return []
    }

    return await ctx
      .table('jobs3', 'threadId', (q) =>
        q.eq('threadId', thread._id).gte('_creationTime', Date.now() - ms('10 minutes')),
      )
      .order('desc')
      .map(async (job) => {
        const fields = pick(job, ['_id', '_creationTime', 'updatedAt', 'status', 'input'])
        return {
          ...fields,
          name: job.pipeline,
          error: job.status === 'failed' ? job.stepResults.at(-1)?.error : undefined,
        }
      })
  },
})

export const createIngestImageUrlJob = internalMutation({
  args: {
    url: v.string(),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.action.ingestImageUrl.run, {
      sourceUrl: args.url,
      sourceType: 'userMessageUrl',
      messageId: args.messageId,
    })
  },
})

export const createEvaluateMessageUrlsJob = async (
  ctx: MutationCtx,
  args: { urls: string[]; messageId: Id<'messages'> },
) => {
  await ctx.scheduler.runAfter(0, internal.action.evaluateMessageUrls.run, {
    urls: args.urls,
    messageId: args.messageId,
  })
}
