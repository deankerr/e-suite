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
  },
})
