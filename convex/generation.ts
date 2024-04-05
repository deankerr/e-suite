import { zid } from 'convex-helpers/server/zod'

import { internal } from './_generated/api'
import { internalAction } from './functions'
import { sinkin } from './providers/sinkin'

export const textToImage = internalAction({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const { parameters } = await ctx.runQuery(internal.messages.generationContext, { messageId })

    const result = await sinkin.textToImage({ parameters })
    console.info(result)

    const imageIds = await Promise.all(
      result.images.map(async (url) => {
        return await ctx.runMutation(internal.files.images.create, {
          sourceUrl: url,
          width: parameters.width,
          height: parameters.height,
        })
      }),
    )

    await ctx.runMutation(internal.messages.update, {
      messageId,
      fields: {
        content: imageIds.map((imageId) => ({
          type: 'image' as const,
          imageId,
        })),
      },
    })
  },
})
