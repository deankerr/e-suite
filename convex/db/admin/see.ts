import { paginationOptsValidator } from 'convex/server'

import { query } from '../../functions'
import { createError } from '../../shared/utils'
import { getImageV1Edges } from '../images'

export const latestImages = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    if (user.role !== 'admin') throw createError('Unauthorized', { code: 'unauthorized' })

    return await ctx
      .table('images_v1')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map(async (image) => await getImageV1Edges(ctx, image))
  },
})
