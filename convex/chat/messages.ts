import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation } from '../_generated/server'
import { vEnum } from '../util'

const chatMessageFields = {
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
  n: v.optional(v.number()),
}

const messagesFields = {
  ...chatMessageFields,
  threadId: v.id('threads'),
  jobId: v.optional(v.id('jobs')),
}

export const messagesTable = defineTable(messagesFields).index('by_threadId', ['threadId'])

export const create = internalMutation({
  args: {
    ...messagesFields,
  },
  handler: async (ctx, args) => await ctx.db.insert('messages', args),
})

export const update = internalMutation({
  args: {
    id: v.id('messages'),
    fields: v.object({ ...chatMessageFields, jobId: v.optional(v.id('jobs')) }),
  },
  handler: async (ctx, { id, fields }) => await ctx.db.patch(id, fields),
})
