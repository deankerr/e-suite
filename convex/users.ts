import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { mutation } from './_generated/server'

const usersFields = {
  tokenIdentifier: v.string(),

  email: v.string(),
  emailVerified: v.boolean(),
  familyName: v.string(),
  givenName: v.string(),
  issuer: v.string(),
  name: v.string(),
  nickname: v.string(),
  phoneNumberVerified: v.boolean(),
  pictureUrl: v.string(),
  subject: v.string(),
  updatedAt: v.string(),
}

export const usersTable = defineTable(usersFields).index('by_token', ['tokenIdentifier'])

export const register = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Called storeUser without authentication present')
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query('users')
      .withIndex('by_token', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
      .unique()
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { ...(identity as Required<typeof identity>) })
      }
      return user._id
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert('users', {
      ...(identity as Required<typeof identity>), //^ might be bad
    })
  },
})
