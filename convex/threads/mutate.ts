import { z } from 'zod'

import { mutation } from '../functions'
import { createJob } from '../jobs/manage'
import { generateRid, insist } from '../utils'
import { zThreadTitle } from '../validators'
import { inferenceSchema, messageFields } from './schema'

export const createThread = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()
    const rid = await generateRid(ctx, 'threads')

    const threadId = await ctx.table('threads').insert({ userId: user._id, rid, private: true })
    return threadId
  },
})

export const removeThread = mutation({
  args: {
    threadId: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
    return id ? await ctx.table('threads').getX(id).delete() : null
  },
})

export const renameThread = mutation({
  args: {
    threadId: z.string(),
    title: zThreadTitle,
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('threads', args.threadId)
    return id ? await ctx.table('threads').getX(id).patch({ title: args.title }) : null
  },
})

export const createMessage = mutation({
  args: {
    threadId: z.string(),
    message: z.object(messageFields),
    inference: inferenceSchema.optional(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewerX()
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    insist(threadId, 'invalid thread id')

    const messageId = await ctx.table('messages').insert({
      threadId,
      ...args.message,
      rid: await generateRid(ctx, 'messages'),
      userId: user._id,
      private: false,
    })

    if (!args.inference) return messageId

    const targetMessageId =
      args.message.role === 'assistant'
        ? messageId
        : await ctx.table('messages').insert({
            threadId,
            role: 'assistant',
            rid: await generateRid(ctx, 'messages'),
            userId: user._id,
            private: false,
            inference: args.inference,
          })

    if (args.inference.type === 'chat-completion') {
      await createJob(ctx, { type: 'chat-completion', messageId: targetMessageId, threadId })
    } else {
      //create job
    }

    return targetMessageId
  },
})

export const removeMessage = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const id = ctx.unsafeDb.normalizeId('messages', args.messageId)
    return id ? await ctx.table('messages').getX(id).delete() : null
  },
})
