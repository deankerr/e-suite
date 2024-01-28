import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { nanoid } from 'nanoid'
import { internalMutation, internalQuery } from './_generated/server'

const authTokensFields = {
  token: v.string(),
  ownerInfo: v.string(),
}

export const authTokensTable = defineTable(authTokensFields)

export const create = internalMutation({
  args: {
    ownerInfo: v.string(),
  },
  handler: async (ctx, { ownerInfo }) => {
    const token = nanoid()
    await ctx.db.insert('authTokens', { token, ownerInfo })
  },
})

export const validate = internalQuery({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const match = await ctx.db
      .query('authTokens')
      .filter((q) => q.eq(q.field('token'), token))
      .collect()
    return !(match === null)
  },
})
