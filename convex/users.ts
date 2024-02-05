import { defineEnt } from 'convex-ents'
import { v } from 'convex/values'
import { internalMutation, mutation } from './_generated/server'
import { assert } from './util'

const usersFields = {
  username: v.string(),
  avatar: v.string(),
  personal: v.object({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }),
}

const usersInternalFields = {
  admin: v.boolean(),
  deleted: v.boolean(),
}

export const usersEnt = defineEnt({ ...usersFields, ...usersInternalFields })
  .edges('threads', { ref: 'ownerId' })
  .edge('apiKey', { optional: true, ref: 'ownerId' })
  .field('tokenIdentifier', v.string(), { index: true })

export const create = internalMutation({
  args: {
    ...usersFields,
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('users', { ...args, admin: false, deleted: false })
  },
})

export const update = internalMutation({
  args: {
    id: v.id('users'),
    fields: v.object({
      username: v.optional(v.string()),
      avatar: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, fields }) => await ctx.db.patch(id, fields),
})

export const authDeleted = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('tokenIdentifier', (q) => q.eq('tokenIdentifier', token))
      .unique()
    assert(user, 'Invalid user token')
    await ctx.db.patch(user._id, { deleted: true })
  },
})

export const register = mutation({
  args: {},
  handler: async (ctx) => {
    // const identity = await ctx.auth.getUserIdentity()
    // if (!identity) {
    //   throw new Error('Called storeUser without authentication present')
    // }
    // const { tokenIdentifier, ...info } = identity
    // // Check if we've already stored this identity before.
    // const user = await ctx.db
    //   .query('users')
    //   .withIndex('by_token', (q) => q.eq('tokenIdentifier', tokenIdentifier))
    //   .unique()
    // if (user !== null) {
    //   // If we've seen this identity before but the name has changed, patch the value.
    //   // if (user.name !== identity.name) {
    //   // await ctx.db.patch(user._id, { ...(identity as Required<typeof identity>) })
    //   // }
    //   return user._id
    // }
    // // If it's a new identity, create a new `User`.
    // return await ctx.db.insert('users', {
    //   tokenIdentifier,
    //   role: 'user',
    //   info: info as Required<typeof info>, //^ this is fine?
    // })
  },
})
