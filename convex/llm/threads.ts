import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { mutation, query } from '../functions'
import { messagesFields } from './messages'

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

export const read = query({
  args: {
    id: v.id('threads'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { id, paginationOpts }) => {
    const thread = await ctx.table('threads').getX(id)
    const messages = await thread.edgeX('messages').paginate(paginationOpts)
    return {
      ...messages,
      thread,
    }
  },
})
