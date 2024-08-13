import { omit } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'

import { query } from '../../functions'
import { createError } from '../../shared/utils'
import { getUserIsViewer } from '../users'

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
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(args.paginationOpts)
      .map((image) => ({
        ...omit(image, ['fileId', 'searchText']),
        userIsViewer: getUserIsViewer(ctx, image.userId),
      }))
  },
})
