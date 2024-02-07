import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { internal } from './_generated/api'
import { internalMutation, internalQuery, mutation, query } from './functions'
import { dispatch } from './jobs'
import { messagesFields } from './threads/messages'

export const get = query({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => {
    return await ctx.table('threads').getX(id)
  },
})

// TODO thread visibility permissions
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.table('threads').paginate(paginationOpts)
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
      .paginate(paginationOpts)
  },
})

export const tail = query({
  args: {
    id: v.id('threads'),
    take: v.optional(v.number()),
  },
  handler: async (ctx, { id, take = 50 }) => {
    const messages = await ctx.table('threads').getX(id).edgeX('messages').order('desc').take(take)
    return messages.reverse()
  },
})

export const getMessageContext = internalQuery({
  args: {
    id: v.id('messages'),
  },
  handler: async (ctx, { id }) => {
    const message = await ctx.table('messages').getX(id)
    return await message
      .edgeX('thread')
      .edgeX('messages')
      .order('desc')
      .filter((q) => q.lte(q.field('_creationTime'), message._creationTime))
  },
})

export const send = mutation({
  args: {
    threadId: v.optional(v.id('threads')),
    messages: v.array(v.object(messagesFields)),
  },
  handler: async (ctx, args) => {
    const existingThread = args.threadId ? await ctx.table('threads').get(args.threadId) : null

    const threadId =
      existingThread?._id ??
      (await ctx.table('threads').insert({ ownerId: ctx.viewerIdX(), name: 'a new thread' }))

    for (const message of args.messages) {
      const name = nameSchema.parse(message.name)
      const content = contentSchema.parse(message.content)
      const newMessageId = await ctx
        .table('messages')
        .insert({ ...message, name, content, threadId })
      if (message.llmParameters && message.role === 'assistant') {
        await ctx.scheduler.runAfter(0, internal.jobs.dispatch, { type: 'llm', ref: newMessageId })
      }
    }

    return threadId
  },
})

export const updateMessage = internalMutation({
  args: {
    id: v.id('messages'),
    content: v.string(),
  },
  handler: async (ctx, { id, content }) => {
    await ctx.table('messages').getX(id).patch({ content })
  },
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
