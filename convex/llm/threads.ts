import { GenericMutationCtx } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { internalQuery as baseInternalQuery } from '../_generated/server'
import { internalMutation, mutation } from '../functions'
import { userInternalMutation, userMutation, userQuery, zInternalQuery } from '../methods'
import { assert } from '../util'
import { createMessage, getMessagesByThreadId, messagesFields } from './messages'

//* Internal

export const getOrCreate = internalMutation({
  args: {
    id: v.optional(v.id('threads')),
  },
  handler: async (ctx, { id }) => {
    const existingThread = id ? await ctx.table('threads').get(id) : null
    const thread =
      existingThread ??
      (await ctx.table('threads').getX(await create(ctx as unknown as GenericMutationCtx<any>, {})))
    return { ...thread, messages: await thread.edgeX('messages') }
  },
})

export const create = internalMutation({
  args: {},
  handler: async (ctx) =>
    await ctx.table('threads').insert({ ownerId: ctx.viewerIdX(), name: 'Untitled thread' }),
})

//* External

export const send = mutation({
  args: {
    threadId: v.optional(v.id('threads')),
    messages: v.array(v.object(messagesFields)),
  },
  handler: async (ctx, { threadId, messages }) => {
    const thread = await getOrCreate(ctx as unknown as GenericMutationCtx<any>, { id: threadId })
    for (const message of messages) {
      const newMessageId = await ctx.table('messages').insert({ ...message, threadId: thread._id })
      if (message.llmParameters && message.role === 'assistant') {
        console.log('todo: schedule llm job', newMessageId)
      }
    }
  },
})

// TODO refactor/remove below
//* Internal
export const getThread = baseInternalQuery({
  args: {
    id: v.id('threads'),
  },
  handler: async (ctx, { id }) => {
    const thread = await ctx.db.get(id)
    assert(thread, 'Invalid thread id')
    const messages = await getMessagesByThreadId(ctx, { threadId: thread._id })
    return {
      ...thread,
      messages,
    }
  },
})

export const tryGetThread = zInternalQuery({
  args: {
    id: z.string().length(32),
  },
  handler: async (ctx, { id }) => {
    const validId = ctx.db.normalizeId('threads', id)
    if (!validId) return null
    const thread = await ctx.db.get(validId)
    if (!thread) return null
    const messages = await getMessagesByThreadId(ctx, { threadId: thread._id })
    return {
      ...thread,
      messages,
    }
  },
})

export const getInactiveThread = baseInternalQuery({
  args: {},
  handler: async (ctx) => {
    const inactiveThread = await ctx.db
      .query('threads')
      .filter((q) => q.neq(q.field('firstMessageId'), undefined))
      .first()
    if (!inactiveThread) return null
    const thread = await getThread(ctx, { id: inactiveThread?._id })
    assert(thread.messages.length > 0, 'Inactive thread has messages')
    return thread
  },
})

export const createThread = userInternalMutation({
  args: {
    name: z
      .string()
      .min(1)
      .max(64)
      .optional()
      .transform((v) => (v ? v : 'Untitled thread')),
  },
  handler: async (ctx, { name }) => await ctx.db.insert('threads', { ownerId: ctx.user._id, name }),
})

export const getOrCreateThread = userInternalMutation({
  args: {
    id: z.string().length(32).optional(),
  },
  handler: async (ctx, { id }) => {
    const validId = id ? ctx.db.normalizeId('threads', id) : null
    const activeThread = validId ? await getThread(ctx, { id: validId }) : null
    //* return valid provided thread
    if (activeThread) return activeThread

    const inactiveThread = await getInactiveThread(ctx, {})
    //* return unused existing thread
    if (inactiveThread) return inactiveThread

    const newThreadId = await createThread(ctx, {})
    const newThread = await getThread(ctx, { id: newThreadId })
    //* return new thread
    return newThread
  },
})

//* External
export const handle = userQuery({
  args: { id: z.string().length(32) },
  handler: async (ctx, { id }) => {
    return await tryGetThread(ctx, { id })
  },
})

export const nsend = userMutation({
  args: {
    threadId: z.string().length(32).optional(),
    message: z.string(),
  },
  handler: async (ctx, { threadId, message }) => {
    const thread = await getOrCreateThread(ctx, { id: threadId })
    const messageId = await createMessage(ctx, { threadId: thread._id, content: message })
    if (!thread.firstMessageId) await ctx.db.patch(thread._id, { firstMessageId: messageId })
    return thread._id
  },
})
