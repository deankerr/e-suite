import { asyncMap } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { query } from '../../functions'
import { createError } from '../../shared/utils'

export const latestImages = query({
  args: {
    order: v.union(v.literal('asc'), v.literal('desc')),
    filter: v.optional(
      v.object({
        name: v.string(),
      }),
    ),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw createError('Unauthorized', { code: 'unauthorized' })

    const filter = args.filter
    if (!filter) return await ctx.table('images').order(args.order).paginate(args.paginationOpts)

    const results = await ctx.table('images').order(args.order).paginate(args.paginationOpts)

    const rr = await asyncMap(results.page, async (image) => {
      const message = await ctx.table('messages').getX(image.messageId!)
      if (message.name === filter.name) return image
    })

    return {
      ...results,
      page: rr.filter((i) => i !== undefined),
    }
  },
})
