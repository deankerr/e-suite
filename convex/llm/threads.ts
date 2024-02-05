import { defineEnt } from 'convex-ents'
import { v } from 'convex/values'
import z from 'zod'
import { internalQuery } from '../_generated/server'
import { userInternalMutation, userMutation, userQuery, zInternalQuery } from '../methods'
import { assert } from '../util'
import { createMessage, getMessagesByThreadId } from './messages'

const threadsFields = {
  name: v.string(),
  firstMessageId: v.optional(v.id('messages')),
}

export const threadsEnt = defineEnt(threadsFields).edge('user', { field: 'ownerId' })

//* Internal
export const getThread = internalQuery({
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

export const getInactiveThread = internalQuery({
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

export const send = userMutation({
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
