import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { internal } from '../_generated/api'
import { internalQuery, mutation, query } from '../functions'
import { messagesFields } from '../schema'
import { assert, vEnum } from '../util'

export const get = query({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => {
    const thread = await ctx.table('threads').getX(id)
    assert(!thread.deletionTime, 'Thread is deleted')
    return thread
  },
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx
      .table('threads')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
  },
})

export const read = query({
  args: {
    id: v.id('threads'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { id, paginationOpts }) => {
    return await ctx
      .table('threads')
      .getX(id)
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
  },
})

export const tail = query({
  args: {
    id: v.id('threads'),
    take: v.optional(v.number()),
  },
  handler: async (ctx, { id, take = 50 }) => {
    const messages = await ctx
      .table('threads')
      .getX(id)
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(take)
    return messages.reverse()
  },
})

export const getMessageContext = internalQuery({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, { id }) => {
    const message = await ctx.table('messages').getX(id)
    const thread = await message.edgeX('thread')

    const messages = await thread
      .edgeX('messages')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .filter((q) => q.lte(q.field('_creationTime'), message._creationTime))
      .docs()

    if (thread.systemPrompt) {
      const systemMessage = {
        role: 'system' as const,
        content: thread.systemPrompt,
        llmParameters: undefined,
      }
      return [systemMessage, ...messages]
    }
    return messages
  },
})

export const send = mutation({
  args: {
    threadId: v.optional(v.id('threads')),
    messages: v.array(v.object(messagesFields)),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingThread = args.threadId ? await ctx.table('threads').get(args.threadId) : null
    const threadId =
      existingThread?._id ??
      (await ctx.table('threads').insert({
        ownerId: ctx.viewerIdX(),
        name: 'a new thread',
        systemPrompt: args.systemPrompt ?? '',
      }))
    const thread = existingThread ?? (await ctx.table('threads').getX(threadId))

    if (args.systemPrompt && thread.systemPrompt !== args.systemPrompt) {
      await thread.patch({ systemPrompt: args.systemPrompt })
    }

    for (const message of args.messages) {
      const name = nameSchema.parse(message.name)
      const content = contentSchema.parse(message.content)
      const newMessageId = await ctx
        .table('messages')
        .insert({ ...message, name, content, threadId })
      if (message.inferenceParameters && message.role === 'assistant') {
        await ctx.scheduler.runAfter(0, internal.jobs.dispatch, {
          type: 'inference',
          messageId: newMessageId,
        })
      }
    }

    return threadId
  },
})

export const updateMessage = mutation({
  args: {
    id: v.id('messages'),
    content: v.string(),
    role: vEnum(['system', 'user', 'assistant']),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...values }) => {
    await ctx
      .table('messages')
      .getX(id)
      .patch({ ...values })
  },
})

export const removeMessage = mutation({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, { id }) => await ctx.table('messages').getX(id).delete(),
})

export const remove = mutation({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => {
    await ctx.table('threads').getX(id).delete()
    return true
  },
})

const nameSchema = z
  .string()
  .optional()
  .transform((v) => (v ? v.slice(0, 32) : undefined))

const contentSchema = z.string().max(20000)
