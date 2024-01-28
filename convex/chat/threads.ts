import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation } from '../_generated/server'

const threadsFields = {
  ownerInfo: v.string(),
  ownerAuthTokenId: v.optional(v.id('authTokens')),
}

export const threadsTable = defineTable(threadsFields)

export const create = internalMutation({
  args: {
    ...threadsFields,
  },
  handler: async (ctx, args) => await ctx.db.insert('threads', args),
})
