import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

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
    // width: z.number().optional(),
  },
  handler: async (ctx, { imageId }) => {
    const id = ctx.unsafeDb.normalizeId('images', imageId)
    const image = id ? await ctx.table('images').get(id) : null
    if (!image) return null

    const imageFiles = await ctx.table('files', 'imageId', (q) => q.eq('imageId', image._id))
    console.log('imageFiles', imageFiles)
    // return latest image file for now
    const fileId = imageFiles.reverse()[0]?.fileId
    return fileId ?? null
  },
})
