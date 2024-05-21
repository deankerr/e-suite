import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery } from '../functions'
import { imageFile } from '../shared/schemas'
import { imageFields } from './schema'

export const create = internalMutation({
  args: {
    ...imageFields,
    messageId: zid('messages'),
  },
  handler: async (ctx, args) => await ctx.table('images').insert(args),
})

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
    const { fileId, format, messageId, originUrl, ...imageArgs } = args

    const imageId = await ctx.table('images').insert({ ...imageArgs, originUrl, messageId })
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

export const getFileId = internalQuery({
  args: {
    imageId: z.string(),
    width: z.number().optional(),
  },
  handler: async (ctx, { imageId, width }) => {
    const id = ctx.unsafeDb.normalizeId('images', imageId)
    const image = id ? await ctx.table('images').get(id) : null
    if (!image) return null

    const imageFiles = await ctx
      .table('files', 'imageId', (q) => q.eq('imageId', image._id))
      .map((file) => imageFile.parse(file))

    const original = imageFiles.find((file) => file.isOriginFile)
    const optimizedOriginal = imageFiles.find(
      (file) => file.width === (original?.width ?? image.width) && !file.isOriginFile,
    )
    const optimized = imageFiles.find((file) => file.width === width)

    return optimized ?? optimizedOriginal ?? original ?? null
  },
})

const srcSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export const serveImage = httpAction(async (ctx, request) => {
  const url = new URL(request.url)
  const imageId = getIdFromPath(url.pathname, '/i')
  const width = normalizeWidthParam(url.searchParams.get('w'))
  const image = imageId
    ? await ctx.runQuery(internal.images.manage.getFileId, { imageId, width: width || undefined })
    : null
  if (!image) return new Response('invalid image id', { status: 400 })

  if (image.isOriginFile && width && width <= image.width) {
    console.log('optimizing for width', width)
    const optimizedBuffer = await ctx.runAction(internal.images.actions.resizeToWebpBuffer, {
      originFileId: image.fileId,
      width,
    })
    if (!optimizedBuffer) return new Response('image resizing failed', { status: 500 })
    const optimizedBlob = new Blob([optimizedBuffer], { type: 'image/webp' })

    await ctx.runMutation(internal.images.manage.createImageFile, {
      fileId: await ctx.storage.store(optimizedBlob),
      isOriginFile: false,
      format: 'webp',
      width,
      height: Math.floor((width / image.width) * image.height),
      imageId: image.imageId,
    })
    return new Response(optimizedBlob)
  }

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) throw new ConvexError('unable to get file id')
  console.log('requested width', width, 'sending', image.width, image.format, image.isOriginFile)
  return new Response(blob)
})

// pathname should be '/i/<id>.ext', verify the route and return the id without extension
const getIdFromPath = (pathname: string, route: string) => {
  const match = pathname.match(new RegExp(`^${route}/([^/]+)\\.([^/]+)$`, 'i'))
  if (!match) return null

  const [, id, _ext] = match
  return id
}

const normalizeWidthParam = (param: string | null) => {
  return srcSizes.findLast((size) => size <= Number(param)) ?? null
}
