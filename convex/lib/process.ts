'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import sharp from 'sharp'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { insist } from './utils'

import type { FormatEnum } from 'sharp'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const BLUR_FORMAT = 'png' as const
const BLUR_SIZE = 8
const BLUR_BRIGHTNESS = 1.4
const BLUR_SATURATION = 1.4

type BlurOptions = {
  format: keyof FormatEnum
  size: number
  brightness: number
  saturation: number
}

export type SharpProcessOptions = {
  blur: Partial<BlurOptions>
}

export const image = internalAction({
  args: {
    source: z.union([
      z.object({ type: z.literal('url'), url: z.string() }),
      z.object({ type: z.literal('storage'), storageId: zid('_storage') }),
    ]),
    imageId: zid('images'),
  },
  handler: async (ctx, { source, imageId }) => {
    const inputBlob =
      source.type === 'url'
        ? await ky.get(source.url).blob()
        : await ctx.storage.get(source.storageId)
    insist(inputBlob, 'failed to get image source')

    const { metadata, webpBlob, blurDataURL, color } = await processImage(inputBlob)
    const sourceBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
    const sourceStorageId = await ctx.storage.store(sourceBlob)
    const sourceStorageUrl = await ctx.storage.getUrl(sourceStorageId)

    const webpStorageId = await ctx.storage.store(webpBlob)
    const webpStorageUrl = await ctx.storage.getUrl(webpStorageId)

    await ctx.runMutation(internal.files.images.update, {
      imageId,
      fields: {
        storageId: webpStorageId,
        storageUrl: webpStorageUrl ?? undefined,
        blurDataURL,
        color,
        sourceStorageId,
        sourceStorageUrl: sourceStorageUrl ?? undefined,
      },
    })
  },
})

export const processImage = async (input: Blob, options?: Partial<SharpProcessOptions>) => {
  const blurOptions = {
    format: BLUR_FORMAT,
    size: BLUR_SIZE,
    brightness: BLUR_BRIGHTNESS,
    saturation: BLUR_SATURATION,
    ...options?.blur,
  }

  const original = await input.arrayBuffer()
  const metadata = await sharp(original)
    .metadata()
    .then(({ width, height, format }) => {
      if (!(width && height && format)) {
        throw Error('Failed to get required image metadata')
      }
      return { width, height, format }
    })

  const webpBuffer = await sharp(original).webp({ effort: 6 }).toBuffer()
  const webpBlob = new Blob([webpBuffer], { type: 'image/webp' })

  // see https://github.com/joe-bell/plaiceholder/blob/main/packages/plaiceholder/src/index.ts
  const pipeline = sharp(original)
    .resize(blurOptions.size, blurOptions.size, { fit: 'inside' })
    .toFormat(blurOptions.format)
    .modulate({
      brightness: blurOptions.brightness,
      saturation: blurOptions.saturation,
    })

  // dominant hex color
  const color = await pipeline
    .clone()
    .stats()
    .then(({ dominant: { r, g, b } }) => {
      return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
    })

  // base64
  const blur = await pipeline.clone().normalise().toBuffer({ resolveWithObject: true })
  const blurDataURL = `data:image/${blur.info.format};base64,${blur.data.toString('base64')}`
  const blurBlob = new Blob([blur.data], { type: `image/${blurOptions.format}` })

  return { input, metadata, webpBlob, blurBlob, blurDataURL, color }
}
