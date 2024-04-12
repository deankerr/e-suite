/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'

import { internalMutation } from '../functions'

export const removeOptimizedImageUrls = internalMutation({
  args: {
    limit: z.number(),
  },
  handler: async (ctx, { limit }) => {
    const images = await ctx.skipRules
      .table('images')
      .order('desc')
      .filter((q) =>
        q.or(
          q.neq(q.field('optimizedStorageId'), undefined),
          q.neq(q.field('optimizedUrl'), undefined),
        ),
      )

    if (!images.length) console.log('no matches')

    await Promise.all(
      images.map(async (image) => {
        image.patch({ optimizedStorageId: undefined, optimizedUrl: undefined })
      }),
    )
  },
})
