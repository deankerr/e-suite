import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import z from 'zod'

import { Id } from './_generated/dataModel'
import { defaultRecentMessagesLimit } from './constants'
import { internalMutation, internalQuery, mutation, query } from './functions'
import { runAction } from './lib/retrier'
import { messagesFields } from './schema'

import type { ChatMessage, MutationCtx } from './types'

const messageSchema = z.object(messagesFields)

const publicMessageSchema = z.object({
  ...messagesFields,
  _id: zid('messages'),
  _creationTime: z.number(),
})
export type Message = z.infer<typeof publicMessageSchema>

//* CRUD
export const createMessage = async (
  ctx: MutationCtx,
  { threadId, message }: { threadId: Id<'threads'>; message: z.infer<typeof messageSchema> },
) => {
  const messageId = await ctx.table('messages').insert({ ...message, threadId })

  if (message.inference) {
    if (message.inference.type === 'chat') {
      const jobId = await runAction(ctx, {
        action: 'completion:completion',
        actionArgs: { messageId },
      })
      await ctx
        .table('messages')
        .getX(messageId)
        .patch({ inference: { ...message.inference, jobId } })
    }

    if (message.inference.type === 'textToImage') {
      const jobId = await runAction(ctx, {
        action: 'generation:textToImage',
        actionArgs: { messageId },
        maxFailures: 2,
      })
      await ctx
        .table('messages')
        .getX(messageId)
        .patch({ inference: { ...message.inference, jobId } })
    }
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

export const get = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return publicMessageSchema.parse(message)
  },
})

export const getContent = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)

    if (!Array.isArray(message.content)) return message

    return {
      ...message,
      content: await Promise.all(
        message.content.map(async ({ imageId }) => await ctx.table('images').getX(imageId)),
      ),
    }
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

    const { inference } = targetMessage
    const recentMessagesLimit =
      inference?.type === 'chat' ? inference.recentMessagesLimit : undefined

    const limit = recentMessagesLimit ?? defaultRecentMessagesLimit

    const thread = await targetMessage.edgeX('thread')
    const recentMessages = await thread
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.lt(q.field('_creationTime'), targetMessage._creationTime))
      .take(limit)

    const persistantMessages = await thread
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('persistant'), true))

    const messages = [
      ...recentMessages,
      ...persistantMessages.filter((p) => !recentMessages.find((m) => m._id === p._id)),
    ]
      .map(({ role, name, content }) => ({ role, name, content }))
      .reverse() as ChatMessage[]

    const context = { messages, inference }

    console.log(context)
    return context
  },
})

export const generationContext = internalQuery({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const { inference } = await ctx.skipRules.table('messages').getX(messageId)

    if (inference && inference.type === 'textToImage') {
      return inference
    }

    throw new ConvexError('Message has no generation inference')
  },
})

export const updateMessageResults = internalMutation({
  args: {
    messageId: zid('messages'),
    content: z.string(),
  },
  handler: async (ctx, { messageId, content }) => {
    const message = await ctx.skipRules.table('messages').getX(messageId)
    await message.patch({ content })

    if (message.inference?.callback) {
      const { url, refId } = message.inference.callback
      await runAction(ctx, {
        action: 'completion:callback',
        actionArgs: {
          url,
          refId,
          content,
        },
      })
    }
  },
})

export const update = internalMutation({
  args: {
    messageId: zid('messages'),
    fields: z.object(messagesFields).partial(),
  },
  handler: async (ctx, { messageId, fields }) =>
    await ctx.skipRules.table('messages').getX(messageId).patch(fields),
})

//* migration
export const migrate = internalMutation({
  args: {
    runMigration: z.string(),
  },
  handler: async (ctx, { runMigration }) => {
    if (runMigration !== 'n') return
  },
})
