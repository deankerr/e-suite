import { paginationOptsValidator } from 'convex/server'

import { query } from '../../functions'
import { createError } from '../../shared/utils'

export const latestImages = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw createError('Unauthorized', { code: 'unauthorized' })

    return await ctx
      .table('images')
      .order('desc')
      .filter((q) => q.neq(q.field('generationData'), undefined))
      .paginate(args.paginationOpts)
  },
})
