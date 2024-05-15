import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { createCompletionJob } from '../completion'
import { internalQuery, mutation, query } from '../functions'
import { createGenerationJob } from '../generation_jobs'
import { completionParameters, generationParameters, messageFields, ridField } from '../schema'
import { generateRid } from '../utils'

// *** public queries ***
// next.js page title/description
export const getPageMetadata = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    const title = `Message from ${message.name ?? message.role}`
    const description = `it's the e/suite - ${title}`

    return {
      title,
      description,
    }
  },
})

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    completions: completionParameters.array().optional(),
    generations: generationParameters.array().optional(),
    private: z.boolean().default(true),
  },
  handler: async (
    ctx,
    { threadId, message: messageFields, completions = [], generations = [], ...args },
  ) => {
    const user = await ctx.viewerX()

    const messageId = await ctx.table('messages').insert({
      threadId,
      ...messageFields,
      rid: await generateRid(ctx, 'messages'),
      userId: user._id,
      private: args.private,
    })

    if (completions.length > 0 || generations.length > 0) {
      const targetMessageId =
        messageFields.role === 'assistant'
          ? messageId
          : await ctx.table('messages').insert({
              threadId,
              role: 'assistant',
              rid: await generateRid(ctx, 'messages'),
              userId: user._id,
              private: args.private,
            })

      for (const parameters of completions) {
        await createCompletionJob(ctx, { parameters, messageId: targetMessageId })
      }

      for (const parameters of generations) {
        await createGenerationJob(ctx, { parameters, messageId: targetMessageId })
      }
    }

    return messageId
  },
})

export const remove = mutation({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.table('messages').getX(messageId).delete()
  },
})
// *** end public queries ****

const messageContextAmount = 20
export const getContext = internalQuery({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const targetMessage = await ctx.table('messages').getX(messageId)
    const thread = await targetMessage.edgeX('thread')

    const contextMessages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', thread._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .filter((q) => q.lt(q.field('_creationTime'), targetMessage._creationTime))
      .filter((q) => q.neq(q.field('content'), undefined))
      .take(messageContextAmount)
      .map(({ role, name, text }) => ({ role, name, content: text! }))

    const messages = contextMessages.toReversed()

    return messages
  },
})
