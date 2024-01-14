'use node'

import { ConvexError, v } from 'convex/values'
import imagesize from 'image-size'
import { api, internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { action, ActionCtx, internalAction, internalMutation } from '../_generated/server'

const maxUploadBytes = 20 * 1024 * 1024
const allowedImageFormats = ['bmp', 'gif', 'heic', 'jpeg', 'jpg', 'png', 'tiff', 'webp'] as const

const kb = (bytes: number) => Math.floor(bytes / 1024)

export const processImage = internalAction({
  args: {
    id: v.id('images'),
  },
  handler: async (ctx, { id }) => {
    const image = await ctx.runQuery(api.files.images.get, { id })
    if (!image) throw new ConvexError({ message: 'no image returned for id', id })

    if (!image?.source) {
      //* fetch source image
      const response = await fetch(new URL(image.sourceUrl as string)) //todo rm cast
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)

      //todo fix sinkin mimetype
      const contentType = response.headers.get('Content-Type')
      const blob = await response.blob()
      const metadata = imagesize(new Uint8Array(await blob.arrayBuffer()))
      console.log(`upload: ${kb(blob.size)}kb "${contentType}"`, metadata)

      if (blob.size > maxUploadBytes) {
        throw new ConvexError({
          message: `max upload size exceeded ${kb(blob.size)}kb / ${kb(maxUploadBytes)}`,
          image,
          metadata,
        })
      }

      if (!allowedImageFormats.find((f) => f === metadata.type)) {
        throw new ConvexError({
          message: `invalid file format: "${metadata.type}"`,
          image,
          metadata,
        })
      }

      const { width, height } = metadata
      if (!width || !height) {
        throw new ConvexError({
          message: `invalid image size: width ${width}, height ${height}`,
          image,
          metadata,
        })
      }

      const source = {
        storageId: await ctx.storage.store(blob),
        width,
        height,
        nsfw: 'unknown',
      }

      await ctx.runMutation(internal.files.images.updateStorage, { id, source })
      return id
    }
  },
})

const timage = {
  sourceUrl: 'https://xono.cx/findLoveAt53.jpg',

  //? optional, rm on success
  error: {
    message: 'dsds',
    createdAt: 432423,
  },

  //? portrait, landscape, square
  source: {
    storageId: 'gdfgdgd3242342f', //* | null
    width: 512,
    height: 123,
    nsfw: 'x',
    blurDataUrl: 'data://dgmkosfjgodfgj', //? optional
    url: 'https://convex',
  },
  thumbnailMd: { storageId: 'gdfgdgd3242342f', width: 512, height: 123, nsfw: 'x' },
  '200x200': { storageId: 'gdfgdgd3242342f', width: 512, height: 123, nsfw: 'x' },
  portraitSm: { storageId: 'gdfgdgd3242342f', width: 512, height: 123, nsfw: 'x' },
  portraitLg: { storageId: 'gdfgdgd3242342f', width: 512, height: 123, nsfw: 'x' },
}
