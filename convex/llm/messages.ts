import { defineEnt } from 'convex-ents'
import { v } from 'convex/values'
import z from 'zod'
import { internalQuery } from '../_generated/server'
import { zInternalMutation } from '../methods'
import { assert, vEnum } from '../util'

export const messageFields = {
  role: vEnum(['system', 'user', 'assistant']),
  name: v.optional(v.string()),
  content: v.string(),
}

export const llmParametersFields = {
  model: v.string(),
  max_tokens: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  temperature: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  repetition_penalty: v.optional(v.number()),
}

export const messagesFields = {
  ...messageFields,
  llmParameters: v.optional(v.object(llmParametersFields)),
}

export const messagesEnt = defineEnt(messagesFields).edge('thread', { field: 'threadId' })

// TODO refactor/remove below
export const getMessagesByThreadId = internalQuery({
  args: {
    threadId: v.id('threads'),
  },
  handler: async (ctx, { threadId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('threadId', (q) => q.eq('threadId', threadId))
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
