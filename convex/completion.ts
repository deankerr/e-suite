'use node'

import { zid } from 'convex-helpers/server/zod'
import { ConvexHttpClient } from 'convex/browser'
import { makeFunctionReference } from 'convex/server'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalAction } from './functions'
import { insist } from './lib/utils'
import { openrouter } from './providers/openrouter'

export const completion = internalAction({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }): Promise<null> => {
    const { messages, inference } = await ctx.runQuery(internal.messages.getCompletionContext, {
      messageId,
    })
    insist(inference, 'Inference parameters missing from target message')
    const { provider, parameters } = inference

    if (provider !== 'openrouter') throw new ConvexError('Provider not implemented')

    const completion = await openrouter.chatCompletion({ messages, parameters })
    console.log(completion, completion.choices)

    const content = completion.choices[0]?.message.content
    insist(content, 'Failed to get completion result', completion as Record<string, any>)

    await ctx.runMutation(internal.messages.updateMessageResults, { messageId, content })

    return null
  },
})

export const callback = internalAction({
  args: {
    url: z.string(),
    refId: z.string(),
    content: z.string(),
  },
  handler: async (ctx, { url, refId, content }) => {
    const client = new ConvexHttpClient(url)
    await client.mutation(makeFunctionReference<'mutation'>('relay:response'), {
      refId,
      content,
    })
  },
})
