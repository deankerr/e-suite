import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalQuery } from '../functions'
import { insist } from '../utils'

const msgSchema = z.object({
  role: z.enum(['system', 'assistant', 'user']),
  name: z.string().optional(),
  content: z.string(),
})

export const getChatCompletionContext = internalQuery({
  args: {
    messageId: zid('messages'),
    take: z.number(),
  },
  handler: async (ctx, { messageId, take }) => {
    const message = await ctx.table('messages').getX(messageId)
    const inference = message.inference
    insist(inference && inference.type === 'chat-completion', 'completion message lacks parameters')

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', message.threadId))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.lt(q.field('_creationTime'), message._creationTime),
          q.neq(q.field('content'), undefined),
        ),
      )
      .take(take)
      .map((message) => msgSchema.parse(message))

    return { message, messages: messages.toReversed(), inference }
  },
})

export const getTitleCompletionContext = internalQuery({
  args: {
    messageId: zid('messages'),
    take: z.number(),
  },
  handler: async (ctx, { messageId, take }) => {
    const message = await ctx.table('messages').getX(messageId)
    const inference = message.inference
    insist(inference && inference.type === 'chat-completion', 'completion message lacks parameters')

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', message.threadId))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('content'), undefined),
          q.neq(q.field('role'), 'system'),
        ),
      )
      .take(take)

    return { message, messages: msgSchema.array().parse(messages), inference }
  },
})
