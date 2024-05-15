import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalQuery, mutation, query } from './functions'
import { inferenceSchema, messageFieldsObject } from './schema'
import * as mutations from './threadsx/mutations'
import * as queries from './threadsx/queries'
import { insist, zPaginationOptValidator } from './utils'
import { zThreadTitle } from './validators'

//* queries
export const getThread = query({
  args: {
    threadId: z.string(),
  },
  handler: queries.getThread,
})

export const listThreads = query({
  args: {},
  handler: queries.listThreads,
})

export const listMessages = query({
  args: {
    threadId: zid('threads'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: queries.listMessages,
})

//* mutations
export const createThread = mutation({
  args: {},
  handler: mutations.createThread,
})

export const removeThread = mutation({
  args: {
    threadId: z.string(),
  },
  handler: mutations.removeThread,
})

export const renameThread = mutation({
  args: {
    threadId: z.string(),
    title: zThreadTitle,
  },
  handler: mutations.renameThread,
})

export const createMessage = mutation({
  args: {
    threadId: z.string(),
    message: messageFieldsObject,
    inference: inferenceSchema.optional(),
  },
  handler: mutations.createMessage,
})

//* internal query
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
