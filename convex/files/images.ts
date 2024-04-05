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

export const update = internalMutation({
  args: {
    imageId: zid('images'),
    fields: z.object(imagesFields).partial(),
  },
  handler: async (ctx, { imageId, fields }) =>
    await ctx.table('images').getX(imageId).patch(fields),
})
