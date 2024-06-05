import { pick } from 'convex-helpers'

import { query } from '../functions'

import type { E_Thread } from '../shared/types'

export const list = query({
  args: {},
  handler: async (ctx): Promise<E_Thread[]> => {
    const userId = ctx.viewerId
    if (!userId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map((thread) =>
        pick(thread, [
          '_id',
          '_creationTime',
          'title',
          'slug',
          'instructions',
          'latestActivityTime',
          'userId',
        ]),
      )

    return threads
  },
})
