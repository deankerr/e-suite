import { filter } from 'convex-helpers/server/filter'
import { zid } from 'convex-helpers/server/zod'

import { query } from './functions'

export const getByMessageId = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const generation = await ctx
      .table('generations', 'messageId', (q) => q.eq('messageId', messageId))
      .first()
    if (!generation) return { jobs: null }

    const fjobs = filter(
      ctx.unsafeDb.system
        .query('_scheduled_functions')
        .withIndex('by_creation_time', (q) => q.gte('_creationTime', generation._creationTime)),
      (job) => {
        if (job.name !== 'generation.js:textToImage') return false
        const [args] = job.args
        if (!args) return false
        if (typeof args !== 'object' || !('generationId' in args)) return false
        return args.generationId === generation._id
      },
    ).collect()

    return fjobs
  },
})
