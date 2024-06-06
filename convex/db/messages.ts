import { pick } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'

import type { E_Message } from '../shared/types'

export const list = query({
  args: {
    threadId: z.string(),
    limit: z.number().max(200).default(50),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, args): Promise<E_Message[]> => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return []

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map((message) =>
        pick(message, [
          '_id',
          '_creationTime',
          'threadId',
          'role',
          'name',
          'content',
          'inference',
          'files',
          'series',
          'userId',
        ]),
      )

    return messages
  },
})
