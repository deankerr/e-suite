import { pick } from 'convex-helpers'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { imagesFieldsV1 } from '../schema'

export const run = internalAction({
  args: {
    ...pick(imagesFieldsV1, ['sourceUrl', 'sourceType', 'generationId']),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url: args.sourceUrl,
    })

    await ctx.runMutation(internal.db.images.createImageV1, {
      fileId,
      ...metadata,
      ...args,
    })
  },
})
