'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import sharp from 'sharp'

import { api, internal } from '../_generated/api'
import { internalAction } from '../functions'
import { insist } from './utils'

export const remoteImage = internalAction({
  args: {
    imageId: zid('images'),
  },
  handler: async (ctx, { imageId }): Promise<void> => {
    const image = await ctx.runQuery(api.files.images.get, { imageId })
    insist(image?.sourceUrl, 'source url missing')

    const imageArrayBuffer = await ky.get(image.sourceUrl).arrayBuffer()

    const metadata = await sharp(imageArrayBuffer)
      .metadata()
      .then(({ width, height, format }) => {
        if (!(width && height && format)) {
          throw Error('Failed to get required image metadata')
        }
        return { width, height, format }
      })

    const sourceBlob = new Blob([imageArrayBuffer], { type: `image/${metadata.format}` })
    const sourceStorageId = await ctx.storage.store(sourceBlob)
    const sourceStorageUrl = await ctx.storage.getUrl(sourceStorageId)

    const imageBuffer = await sharp(imageArrayBuffer).webp().toBuffer()
    const imageBlob = new Blob([imageBuffer], { type: 'image/webp' })
    const imageStorageId = await ctx.storage.store(imageBlob)
    const imageStorageUrl = await ctx.storage.getUrl(imageStorageId)

    await ctx.runMutation(internal.files.images.update, {
      imageId,
      fields: {
        storageId: imageStorageId,
        storageUrl: imageStorageUrl ?? undefined,
        sourceStorageId,
        sourceStorageUrl: sourceStorageUrl ?? undefined,
      },
    })
  },
})
