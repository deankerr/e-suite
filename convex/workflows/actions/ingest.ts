import { internal } from '../../_generated/api'

import type { Id } from '../../_generated/dataModel'
import type { ActionCtx } from '../../_generated/server'

export const images = async (
  ctx: ActionCtx,
  { imageUrls, messageId }: { imageUrls: string[]; messageId: Id<'messages'> },
) => {
  const imageIds: string[] = []

  for (const url of imageUrls) {
    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
      url,
    })

    const imageId = await ctx.runMutation(internal.db.images.createImageWf, {
      fileId,
      ...metadata,
      sourceUrl: url,
      messageId: messageId,
    })

    imageIds.push(imageId)
  }

  return { imageIds }
}
