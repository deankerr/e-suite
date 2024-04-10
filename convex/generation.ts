import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'

import { internal } from './_generated/api'
import { internalAction } from './functions'
import { sinkin } from './providers/sinkin'
import { generationDimensionsSchema } from './schema'

export const textToImage = internalAction({
  args: {
    messageId: zid('messages'),
    dimensions: generationDimensionsSchema,
  },
  handler: async (ctx, { messageId, dimensions }) => {
    const { parameters } = await ctx.runQuery(internal.messages.generationContext, { messageId })

    const { result, error } = await sinkin.textToImage({ parameters, dimensions })

    if (error) {
      if (error.noRetry) {
        console.error(error.message, 'noRetry:', error.noRetry)
        return
      }

      throw new ConvexError(error)
    }

    const imageIds = await Promise.all(
      result.images.map(async (url) => {
        return await ctx.runMutation(internal.files.images.create, {
          sourceUrl: url,
          width: dimensions.width,
          height: dimensions.height,
        })
      }),
    )

    await ctx.runMutation(internal.messages.appendContent, {
      messageId,
      content: imageIds.map((imageId) => ({
        type: 'image' as const,
        imageId,
      })),
    })
  },
})
