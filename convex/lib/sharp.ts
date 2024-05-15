'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import sharp from 'sharp'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { imageSrcsetWidths } from '../constants'
import { internalAction } from '../functions'
import { insist } from '../utils'

import type { Id } from '../_generated/dataModel'
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
  resizeWidths?: number[]
}

//* Actions
// export const createGeneratedImageFromUrl = internalAction({
//   args: {
//     sourceUrl: z.string(),
//     generationJobId: zid('generation_jobs'),
//   },
//   handler: async (ctx, { sourceUrl, generationJobId }) => {
//     const inputBlob = await ky.get(sourceUrl).blob()
//     const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)

//     const sourceBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
//     const sourceFileId = await ctx.storage.store(sourceBlob)
//     const webpStorageId = await ctx.storage.store(webpBlob)

//     // await ctx.runMutation(internal.generated_images.create, {
//     //   generationJobId,
//     //   width: metadata.width,
//     //   height: metadata.height,
//     //   sourceFileId,
//     //   fileId: webpStorageId,
//     //   sourceUrl,
//     //   blurDataUrl,
//     //   color,
//     // })
//   },
// })

export const createAppImageFromUrl = internalAction({
  args: {
    sourceUrl: z.string(),
  },
  handler: async (ctx, { sourceUrl }) => {
    const inputBlob = await ky.get(sourceUrl).blob()

    const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)
    const sourceBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
    const sourceFileId = await ctx.storage.store(sourceBlob)
    const webpStorageId = await ctx.storage.store(webpBlob)

    const srcsetBlobs = await processImageSrcset(inputBlob, imageSrcsetWidths)
    const srcset: { width: number; fileId: Id<'_storage'> }[] = []
    for (const { width, blob } of srcsetBlobs) {
      const resizedFileId = await ctx.storage.store(blob)
      srcset.push({ width, fileId: resizedFileId })
    }

    await ctx.runMutation(internal.app_images.create, {
      width: metadata.width,
      height: metadata.height,
      sourceUrl,
      sourceFileId,
      fileId: webpStorageId,
      blurDataUrl,
      color,
      srcset,
    })
  },
})

export const generatedImageSrcset = internalAction({
  args: {
    fileId: zid('_storage'),
    generatedImageId: zid('generated_images'),
  },
  handler: async (ctx, { fileId, generatedImageId }) => {
    const input = await ctx.storage.get(fileId)
    insist(input, 'invalid file id')
    const srcsetBlobs = await processImageSrcset(input, imageSrcsetWidths)

    const srcset: { width: number; fileId: Id<'_storage'> }[] = []
    for (const { width, blob } of srcsetBlobs) {
      const resizedFileId = await ctx.storage.store(blob)
      srcset.push({ width, fileId: resizedFileId })
    }

    await ctx.runMutation(internal.generated_images.updateSrcset, { generatedImageId, srcset })
  },
})

//* Implementations
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
        throw new Error('Failed to get required image metadata')
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

export const processImageSrcset = async (input: Blob, widths: Readonly<number[]>) => {
  const arrBuffer = await input.arrayBuffer()
  const metadata = await sharp(arrBuffer)
    .metadata()
    .then(({ width, height, format }) => {
      if (!(width && height && format)) {
        throw new Error('Failed to get required image metadata')
      }
      return { width, height, format }
    })

  const pipeline = sharp(arrBuffer)
  const srcset: { width: number; blob: Blob }[] = []

  for (const width of widths) {
    if (width >= metadata.width) continue

    const resizedBuffer = await pipeline.clone().resize({ width }).toBuffer()
    const resizedBlob = new Blob([resizedBuffer], { type: input.type })
    srcset.push({ width, blob: resizedBlob })
  }

  return srcset
}
