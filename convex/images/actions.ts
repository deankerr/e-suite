import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'

import type { Id } from '../_generated/dataModel'

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
