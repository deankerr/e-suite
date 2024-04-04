import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { Id } from './_generated/dataModel'
import { internalMutation, internalQuery, mutation, query } from './functions'
import { runAction } from './lib/retrier'
import { insist } from './lib/utils'
import { messagesFields } from './schema'

import type { ChatMessage, MutationCtx } from './types'

const messageSchema = z.object(messagesFields)

const publicMessageSchema = z.object({
  ...messagesFields,
  _id: zid('messages'),
  _creationTime: z.number(),
})

//* CRUD
export const createMessage = async (
  ctx: MutationCtx,
  { threadId, message }: { threadId: Id<'threads'>; message: z.infer<typeof messageSchema> },
) => {
  const parsed = z.object(messagesFields).parse(message)
  const messageId = await ctx.table('messages').insert({ ...parsed, threadId, persistant: false })

  if (parsed.inference) {
    const jobId = await runAction(ctx, {
      action: 'completion:completion',
      actionArgs: { messageId },
    })
    await ctx
      .table('messages')
      .getX(messageId)
      .patch({ inference: { ...parsed.inference, jobId } })
  }
  return messageId
}

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messagesFields),
  },
  handler: async (ctx, args) => {
    return await createMessage(ctx, args)
  },
})

export const createMessages = async (
  ctx: MutationCtx,
  { threadId, messages }: { threadId: Id<'threads'>; messages: z.infer<typeof messageSchema>[] },
) => {
  return await Promise.all(
    messages.map(async (message) => {
      const parsed = z.object(messagesFields).parse(message)
      const messageId = await ctx
        .table('messages')
        .insert({ ...parsed, threadId, persistant: false })

      if (parsed.inference) {
        const jobId = await runAction(ctx, {
          action: 'completion:completion',
          actionArgs: { messageId },
        })
        await ctx
          .table('messages')
          .getX(messageId)
          .patch({ inference: { ...parsed.inference, jobId } })
      }
      return messageId
    }),
  )
}

export const createMany = mutation({
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

//* Inference
export const getCompletionContext = internalQuery({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const targetMessage = await ctx.skipRules.table('messages').getX(messageId)
    insist(targetMessage.inference, 'Parameters missing from target message')

    const thread = await targetMessage.edgeX('thread')
    const messages = await thread
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.lt(q.field('_creationTime'), targetMessage._creationTime))
      .take(20)
      .map((message) => {
        const { role, name, content = '' } = message
        if (role === 'user') {
          return {
            role,
            content,
            name,
          }
        }

        return {
          role,
          content,
        }
      })

    return { messages: messages.reverse() as ChatMessage[], ...targetMessage.inference }
  },
})

export const updateMessageResults = internalMutation({
  args: {
    messageId: zid('messages'),
    content: z.string(),
  },
  handler: async (ctx, { messageId, content }) => {
    return await ctx.skipRules.table('messages').getX(messageId).patch({ content })
  },
})
