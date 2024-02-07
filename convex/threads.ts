import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { mutation, query } from './functions'
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
      const newMessageId = await ctx.table('messages').insert({ ...message, threadId })
      if (message.llmParameters && message.role === 'assistant') {
        console.log('todo: schedule llm job', newMessageId)
      }
    }

    return threadId
  },
})
