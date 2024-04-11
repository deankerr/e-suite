'use node'

import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import sharp from 'sharp'

import { api, internal } from '../_generated/api'
import { internalAction } from '../functions'

export const image = internalAction({
  args: {
    imageId: zid('images'),
  },
  handler: async (ctx, { imageId }) => {
    const image = await ctx.runQuery(api.files.images.get, { imageId })
    if (!image) throw new ConvexError('invalid image id')
    if (!image.storageId) throw new ConvexError('image lacks storage id')

    const blob = await ctx.storage.get(image.storageId)
    if (!blob) throw new ConvexError('invalid storage id')
    const arrayBuffer = await blob.arrayBuffer()

    const result = await sharp(arrayBuffer).webp().toBuffer()
    const webpBlob = new Blob([result.buffer], { type: 'image/webp' })

    const id = await ctx.storage.store(webpBlob)
    const url = await ctx.storage.getUrl(id)

    await ctx.runMutation(internal.files.images.update, {
      imageId,
      fields: {
        optimizedStorageId: id,
        optimizedUrl: url ?? undefined,
      },
    })
  },
})
