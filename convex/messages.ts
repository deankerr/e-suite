import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { Id } from './_generated/dataModel'
import { mutation, query } from './functions'
import { messagesFields } from './schema'
import { MutationCtx } from './types'

const messageSchema = z.object(messagesFields)

const publicMessageSchema = z.object({
  ...messagesFields,
  _id: zid('messages'),
  _creationTime: z.number(),
})

//* CRUD
export const createMessages = async (
  ctx: MutationCtx,
  { threadId, messages }: { threadId: Id<'threads'>; messages: z.infer<typeof messageSchema>[] },
) => {
  return await Promise.all(
    messages.map(async (message) => {
      const parsed = z.object(messagesFields).parse(message)
      return await ctx.table('messages').insert({ ...parsed, threadId })
    }),
  )
}

export const create = mutation({
  args: {
    threadId: zid('threads'),
    messages: z.object(messagesFields).array(),
  },
  handler: async (ctx, args) => {
    return await createMessages(ctx, args)
  },
})

export const get = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return publicMessageSchema.parse(message)
  },
})

export const list = query({
  args: {
    threadId: zid('threads'),
    limit: z.number().gte(1).lte(100).default(20),
  },
  handler: async (ctx, { threadId, limit }) => {
    return await ctx
      .table('threads')
      .getX(threadId)
      .edgeX('messages')
      .order('desc')
      .take(limit)
      .map((message) => publicMessageSchema.parse(message))
  },
})
