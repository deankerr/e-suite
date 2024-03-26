import { v } from 'convex/values'
import z from 'zod'

import { Id } from './_generated/dataModel'
import { internalMutation, mutation, query } from './functions'
import { usersFields } from './schema'
import { QueryCtx } from './types'

export type User = z.infer<typeof publicUserSchema>

const publicUserSchema = z.object({
  _id: z
    .string()
    .length(32)
    .transform((v) => v as Id<'users'>),
  username: z.string(),
  avatar: z.string(),
  isAdmin: z.boolean(),
  isViewer: z.boolean(),
})

export const getUser = async (ctx: QueryCtx, id: Id<'users'>) => {
  const user = await ctx.table('users').getX(id)
  const isViewer = ctx.viewerId === user._id
  return publicUserSchema.parse({ ...user, isViewer })
}

export const getViewerUser = async (ctx: QueryCtx) => {
  const user = await ctx.viewer()
  return publicUserSchema.parse({ ...user, isViewer: true })
}

export const getViewer = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewer()
    if (user?.deletionTime) return null
    return user
  },
})

export const create = internalMutation({
  args: {
    ...usersFields,
    tokenIdentifier: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('users').insert({ ...args, isAdmin: false })
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

export const updateUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const username = args.username.slice(0, 32)
    if (!username.length) return null
    const user = await ctx.viewerX()
    await user.patch({ username })
  },
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
