'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import sharp from 'sharp'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'

import type { FormatEnum } from 'sharp'

const BLUR_FORMAT: keyof FormatEnum = 'png'
const BLUR_SIZE = 8
const BLUR_BRIGHTNESS = 1.25
const BLUR_SATURATION = 1.4

type BlurOptions = {
  format: keyof FormatEnum
  size: number
  brightness: number
  saturation: number
}

type SharpProcessOptions = {
  blur: Partial<BlurOptions>
}

export const processGenerationUrl = internalAction({
  args: {
    sourceUrl: z.string(),
    generationId: zid('generations'),
  },
  handler: async (ctx, { sourceUrl, generationId }) => {
    const inputBlob = await ky.get(sourceUrl).blob()
    const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)

    const sourceBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
    const sourceFileId = await ctx.storage.store(sourceBlob)
    const webpStorageId = await ctx.storage.store(webpBlob)

    await ctx.runMutation(internal.generated_images.create, {
      generationId,
      width: metadata.width,
      height: metadata.height,
      sourceFileId,
      fileId: webpStorageId,
      sourceUrl,
      blurDataUrl,
      color,
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
  const blurDataUrl = `data:image/${blur.info.format};base64,${blur.data.toString('base64')}`
  const blurBlob = new Blob([blur.data], { type: `image/${blurOptions.format}` })

  return { input, metadata, webpBlob, blurBlob, blurDataUrl, color }
}
