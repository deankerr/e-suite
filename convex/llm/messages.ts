import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { internalQuery } from '../_generated/server'
import { zInternalMutation } from '../methods'
import { assert, vEnum } from '../util'

export const chatMessageFields = {
  role: vEnum(['system', 'user', 'assistant']),
  name: v.optional(v.string()),
  content: v.string(),
}

export const chatParametersFields = {
  model: v.string(),
  max_tokens: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  temperature: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  repetition_penalty: v.optional(v.number()),
}

const messagesFields = {
  ...chatMessageFields,
  threadId: v.id('threads'),
  jobId: v.optional(v.id('jobs')),
}

export const messagesTable = defineTable(messagesFields).index('by_threadId', ['threadId'])

export const getMessagesByThreadId = internalQuery({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_threadId', (q) => q.eq('threadId', threadId))
      .collect()
  },
})

export const createMessage = zInternalMutation({
  args: {
    threadId: z.string().length(32),
    content: z.string(),
  },
  handler: async (ctx, { threadId, content }) => {
    const vThreadId = ctx.db.normalizeId('threads', threadId)
    assert(vThreadId, 'Invalid thread id')
    const id = await ctx.db.insert('messages', { threadId: vThreadId, role: 'user', content })
    return id
  },
})
