import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery } from '../functions'
import { imageFile } from '../shared/schemas'
import { imageFields } from './schema'

const srcSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export const createImageFile = internalMutation({
  args: {
    fileId: zid('_storage'),
    isOriginFile: z.boolean(),
    format: z.string(),
    width: z.number(),
    height: z.number(),
    imageId: zid('images'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('files').insert({ ...args, category: 'image' })
  },
})

export const createImage = internalMutation({
  args: {
    ...imageFields,
    format: z.string(),
    fileId: zid('_storage'),
    originUrl: z.string(),
    messageId: zid('messages'),
  },
  handler: async (ctx, args) => {
    const { fileId, format, originUrl, ...imageArgs } = args

    const imageId = await ctx.table('images').insert({ ...imageArgs, originUrl })
    await ctx.table('files').insert({
      category: 'image',
      format,
      fileId,
      isOriginFile: true,
      width: imageArgs.width,
      height: imageArgs.height,
      imageId,
    })

    return imageId
  },
})

export const getImageWithFiles = internalQuery({
  args: {
    imageId: z.string(),
  },
  handler: async (ctx, args) => {
    const imageId = ctx.unsafeDb.normalizeId('images', args.imageId)
    const image = imageId ? await ctx.table('images').get(imageId) : null
    if (!image) return null

    const imageFiles = await ctx
      .table('files', 'imageId', (q) => q.eq('imageId', image._id))
      .map((file) => imageFile.parse(file))

    const original = imageFiles.find((file) => file.isOriginFile)
    const optimized = imageFiles
      .filter((file) => !file.isOriginFile)
      .sort((a, b) => a.width - b.width)

    return { image, original, optimized }
  },
})

export const serveOptimizedImage = httpAction(async (ctx, request) => {
  const imageRequest = parseRequestUrl(request.url, '/i')
  if (!imageRequest || !imageRequest.id) return new Response('invalid request', { status: 400 })
  const imageFiles = await ctx.runQuery(internal.images.manage.getImageWithFiles, {
    imageId: imageRequest.id,
  })
  if (!imageFiles || !imageFiles.original) return new Response('invalid image id', { status: 400 })

  const targetWidth = imageRequest.width
    ? Math.min(imageRequest.width, imageFiles.original.width)
    : imageFiles.original.width
  const optimizedFile = imageFiles.optimized.find((file) => file.width === targetWidth)

  // return file of matching width if exists
  if (optimizedFile) {
    console.log('targetWidth', targetWidth, 'using optimized:', optimizedFile.width)
    const blob = await ctx.storage.get(optimizedFile.fileId)
    return new Response(blob)
  }

  console.log('targetWidth', targetWidth, 'not found')
  // create optimized file for width
  const fileId = await ctx.runAction(internal.images.actions.optimize, {
    imageId: imageFiles.image._id,
    originFileId: imageFiles.original.fileId,
    width: targetWidth,
  })

  const blob = await ctx.storage.get(fileId)
  return new Response(blob)
})

function parseRequestUrl(url: string, route: string) {
  const { pathname, searchParams } = new URL(url)

  // parse image id, extension from pathname
  const match = pathname.match(new RegExp(`^${route}/([^/]+)\\.([^/]+)$`, 'i'))
  if (!match) {
    console.error('invalid pathname', pathname)
    return null
  }
  const [, id, extension] = match

  // parse width param to closest valid size
  const width = srcSizes.findLast((size) => size <= Number(searchParams.get('w')))
  return { id, extension, width }
}
