import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery } from '../functions'
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
    return await ctx.table('files').insert({ ...args, category: 'image', isOrphaned: false })
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

    const imageFiles = await ctx.table('files', 'imageId', (q) => q.eq('imageId', image._id))

    // imageFiles.sort((a, b) => b.width - a.width)
    // return latest image file for now
    const file = imageFiles.reverse()[0]
    if (!file) return null
    console.log('requested width', width, 'sending', imageFiles.reverse()[0]?.width)
    return file.fileId
  },
})

// const srcSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export const serveImage = httpAction(async (ctx, request) => {
  const url = new URL(request.url)
  const imageId = getIdFromPath(url.pathname, '/i')
  const width = Number(url.searchParams.get('w'))
  const fileId = imageId
    ? await ctx.runQuery(internal.images.manage.getFileId, { imageId, width: width || undefined })
    : null
  if (!fileId) return new Response('invalid image id', { status: 400 })

  const blob = await ctx.storage.get(fileId)
  if (!blob) throw new ConvexError('unable to get file id')
  return new Response(blob)
})

// pathname should be '/i/<id>.ext', verify the route and return the id without extension
const getIdFromPath = (pathname: string, route: string) => {
  const match = pathname.match(new RegExp(`^${route}/([^/]+)\\.([^/]+)$`, 'i'))
  if (!match) return null

  const [, id, _ext] = match
  return id
}
