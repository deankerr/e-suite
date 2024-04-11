'use node'

import { Buffer } from 'node:buffer'
import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import { getPlaiceholder } from 'plaiceholder'

import { api, internal } from '../_generated/api'
import { internalAction } from '../functions'
import { insist } from './utils'

export const retrieve = internalAction({
  args: {
    imageId: zid('images'),
  },
  handler: async (ctx, { imageId }): Promise<void> => {
    const image = await ctx.runQuery(api.files.images.get, { imageId })
    insist(image, 'Invalid image id')

    const response = await ky.get(image.sourceUrl).arrayBuffer()

    const {
      color: { hex },
      base64,
      metadata: { width, height, format },
    } = await getPlaiceholder(Buffer.from(response))

    const blob = new Blob([response], { type: getMIMEType(format) })

    const storageId = await ctx.storage.store(blob)
    const storageUrl = (await ctx.storage.getUrl(storageId)) ?? undefined

    // todo merge these tasks into one sharp run
    await ctx.scheduler.runAfter(0, internal.lib.process.image, { imageId })

    await ctx.runMutation(internal.files.images.update, {
      imageId,
      fields: {
        storageId,
        storageUrl,
        blurDataURL: base64,
        color: hex,
        width: width,
        height: height,
      },
    })
  },
})

const getMIMEType = (format?: string) => {
  if (!format) return ''
  if (format === 'jpg') return 'image/jpeg'
  if (format === 'heif') return 'image/heic'
  if (['avif', 'gif', 'jpeg', 'png', 'tiff', 'webp'].includes(format)) return `image/${format}`
  return ''
}
