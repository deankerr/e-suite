import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, query } from '../functions'
import { runAction } from '../lib/retrier'
import { imagesFields } from '../schema'

export const create = internalMutation({
  args: {
    ...imagesFields,
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images').insert(args).get()

    if (!image.storageId) {
      const jobId = await runAction(ctx, {
        action: 'lib/image:retrieve',
        actionArgs: { imageId: image._id },
      })

      await image.patch({ jobId })
    }

    return image._id
  },
})

export const get = query({
  args: {
    imageId: zid('images'),
  },
  handler: async (ctx, { imageId }) => await ctx.table('images').get(imageId),
})

export const getMany = query({
  args: {
    imageIds: z.union([zid('images'), z.null()]).array(),
  },
  handler: async (ctx, { imageIds }) => {
    const images = await Promise.all(
      imageIds.map(async (id) => (id ? await ctx.table('images').get(id) : null)),
    )
    return images
  },
})

export const update = internalMutation({
  args: {
    imageId: zid('images'),
    fields: z.object(imagesFields).partial(),
  },
  handler: async (ctx, { imageId, fields }) =>
    await ctx.table('images').getX(imageId).patch(fields),
})

export const list = query({
  args: {
    limit: z.number().default(20),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, { limit, order }) => await ctx.table('images').order(order).take(limit),
})
