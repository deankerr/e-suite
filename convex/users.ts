import { v } from 'convex/values'
import { Id } from './_generated/dataModel'
import { internalMutation, query } from './functions'
import { usersFields } from './schema'
import { QueryCtx } from './types'

export const getUser = async (ctx: QueryCtx, id: Id<'users'>) => {
  const user = await ctx.table('users').getX(id)
  return {
    _id: user._id,
    username: user.username,
    avatar: user.avatar,
    admin: user.admin,
  }
}

export const create = internalMutation({
  args: {
    ...usersFields,
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('users').insert({ ...args, admin: false })
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
  handler: async (ctx, { id, fields }) => await ctx.table('users').getX(id).patch(fields),
})

export const authDeleted = internalMutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, { token }) => {
    await ctx
      .table('users', 'tokenIdentifier', (q) => q.eq('tokenIdentifier', token))
      .uniqueX()
      .delete()
  },
})

//* permissions testing
export const getPrivateProfile = query({
  args: {
    id: v.optional(v.id('users')),
  },
  handler: async (ctx, { id }) => {
    const user = await ctx.table('users').getX(id ?? ctx.viewerIdX())
    const key = await user.edge('apiKey')
    return {
      ...user,
      key,
    }
  },
})
