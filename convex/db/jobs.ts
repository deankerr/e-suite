import { pick } from 'convex-helpers'
import { v } from 'convex/values'
import { ms } from 'itty-time'

import { query } from '../functions'
import { getThreadBySlugOrId } from './threads'

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
