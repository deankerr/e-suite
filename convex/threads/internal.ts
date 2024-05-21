import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internalMutation, internalQuery } from '../functions'
import { jobTypesEnum } from '../jobs/schema'
import { insist } from '../shared/utils'

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
    threadId: zid('threads'),
    take: z.number(),
  },
  handler: async (ctx, { threadId, take }) => {
    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order('desc')
      .filter((q) =>
        q.and(
          q.eq(q.field('deletionTime'), undefined),
          q.neq(q.field('content'), undefined),
          q.neq(q.field('role'), 'system'),
          q.neq(q.field('content'), undefined),
        ),
      )
      .take(take)
      .map((message) => msgSchema.parse(message))
    console.log('getcontext', messages)
    return { messages: messages.toReversed() }
  },
})

export const getMessageWithJobsOfType = internalQuery({
  args: {
    messageId: zid('messages'),
    jobType: jobTypesEnum,
  },
  handler: async (ctx, { messageId, jobType }) => {
    const message = await ctx.table('messages').getX(messageId)
    const jobs = await ctx
      .table('jobs', 'messageId', (q) => q.eq('messageId', messageId))
      .filter((q) => q.eq(q.field('type'), jobType))
    return { message, jobs }
  },
})

export const appendImage = internalMutation({
  args: {
    messageId: zid('messages'),
    imageId: zid('images'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.table('messages').getX(args.messageId)
    await message.patch({
      files: (message.files ?? []).concat({ type: 'image', id: args.imageId }),
    })
  },
})
