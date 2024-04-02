import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { internalMutation, internalQuery, mutation, query } from './functions'
import { generateRandomString, insist } from './lib/utils'
import { usersFields } from './schema'
import { QueryCtx } from './types'

const publicUserSchema = z
  .object({ ...usersFields })
  .transform((user) => ({ ...user, apiKey: undefined }))

const userBySchema = z.union([
  z.object({ id: zid('users') }),
  z.object({ tokenIdentifier: z.string() }),
])

export const getCurrentUser = async (ctx: QueryCtx) => {
  const user = await ctx.viewer()
  return publicUserSchema.nullable().parse(user)
}

export const getCurrentUserX = async (ctx: QueryCtx) => {
  const user = await getCurrentUser(ctx)
  insist(user, 'Unable to get current user')
  return user
}

//* CRUD
export const get = internalQuery({
  args: {
    id: zid('users'),
  },
  handler: async (ctx, { id }) => await ctx.table('users').get(id),
})

export const getSelf = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewer()
    return publicUserSchema.nullable().parse(user)
  },
})

export const create = internalMutation({
  args: {
    fields: z.object({ tokenIdentifier: z.string(), ...usersFields }),
  },
  handler: async (ctx, { fields }) => await ctx.table('users').insert(fields),
})

export const update = internalMutation({
  args: {
    by: userBySchema,
    fields: z.object(usersFields).partial(),
  },
  handler: async (ctx, { by, fields }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).patch(fields)
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).patch(fields)
  },
})

export const remove = internalMutation({
  args: {
    by: userBySchema,
  },
  handler: async (ctx, { by }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).delete()
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).delete()
  },
})

//* Users API Keys
export const generateNextApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()

    const existingKeys = await ctx.table('users_api_keys', 'userId', (q) =>
      q.eq('userId', user._id),
    )
    existingKeys.forEach(async (key) => key.patch({ valid: false }))

    const apiKey = `esk_${generateRandomString(32)}`
    return await ctx
      .table('users_api_keys')
      .insert({ secret: apiKey, valid: true, userId: user._id })
  },
})
