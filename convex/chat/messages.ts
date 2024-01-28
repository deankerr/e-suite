import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation } from '../_generated/server'
import { chatMessageFields } from '../shared'
import { vEnum } from '../util'

const messagesFields = {
  ...chatMessageFields,
  threadId: v.id('threads'),
  jobId: v.optional(v.id('jobs')),
  data: v.any(),
}

export const messagesTable = defineTable(messagesFields).index('by_threadId', ['threadId'])

export const create = internalMutation({
  args: {
    ...messagesFields,
  },
  handler: async (ctx, args) => await ctx.db.insert('messages', args),
})
