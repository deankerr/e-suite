'use node'

import { zid } from 'convex-helpers/server/zod'
import sharp from 'sharp'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'

import type { Id } from '../_generated/dataModel'

export const ingestFromUrl = internalAction({
  args: {
    url: z.string(),
    messageId: zid('messages'),
  },
  handler: async (ctx, args): Promise<Id<'images'>> => {
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url: args.url,
    })

    const imageId: Id<'images'> = await ctx.runMutation(internal.images.manage.createImage, {
      ...metadata,
      fileId,
      messageId: args.messageId,
      originUrl: args.url,
      generationData: [],
    })

    return imageId
  },
})

export const optimizeImageToWidth = internalAction({
  args: {
    imageId: zid('images'),
    originFileId: zid('_storage'),
    width: z.number(),
  },
  handler: async (ctx, args): Promise<Id<'_storage'>> => {
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.fileToWebpResize, {
      fileId: args.originFileId,
      width: args.width,
    })

    await ctx.runMutation(internal.images.manage.createImageFile, {
      ...metadata,
      fileId,
      imageId: args.imageId,
      format: 'webp',
      isOriginFile: false,
    })

    return fileId
  },
})

export const resizeToWebpBuffer = internalAction({
  args: {
    originFileId: zid('_storage'),
    width: z.number(),
  },
  handler: async (ctx, args) => {
    try {
      const inputBlob = await ctx.storage.get(args.originFileId)
      if (!inputBlob) return null

      const buffer = await sharp(await inputBlob.arrayBuffer())
        .webp()
        .resize({ width: args.width })
        .toBuffer()

      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer
      return arrayBuffer
    } catch (err) {
      console.error(err)
      return null
    }
  },
})
