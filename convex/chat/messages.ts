import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation } from '../_generated/server'
import { chatMessageFields } from '../shared'
import { vEnum } from '../util'

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
