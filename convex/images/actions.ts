import { zid } from 'convex-helpers/server/zod'
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

    await ctx.runMutation(internal.threads.internal.appendImage, {
      messageId: args.messageId,
      imageId,
    })

    console.log('ingested image:', metadata.format, `${metadata.width}x${metadata.height}`)
    return imageId
  },
})

export const optimize = internalAction({
  args: {
    imageId: zid('images'),
    originFileId: zid('_storage'),
    width: z.number(),
  },
  handler: async (ctx, args): Promise<Id<'_storage'>> => {
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.convertToWebpAndResize, {
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

    console.log('optimized webp width:', metadata.width)
    return fileId
  },
})
