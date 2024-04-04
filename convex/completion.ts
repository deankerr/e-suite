'use node'

import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'

import { internal } from './_generated/api'
import { internalAction } from './functions'
import { insist } from './lib/utils'
import { openrouter } from './providers/openrouter'

export const completion = internalAction({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const { messages, provider, parameters } = await ctx.runQuery(
      internal.messages.getCompletionContext,
      { messageId },
    )
    insist(parameters, 'Parameters missing from target message')

    if (provider !== 'openrouter') throw new ConvexError('Provider not implemented')

    const result = await openrouter.chatCompletion({ messages, parameters })
    const { content } = result.message
    insist(content !== null, 'Failed to get completion result')

    console.log('result:', result.message.content, result.finish_reason)
    await ctx.runMutation(internal.messages.updateMessageResults, { messageId, content })

    return null
  },
})
