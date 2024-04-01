import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { internalMutation, internalQuery, query } from './functions'
import { generateRandomString } from './lib/utils'
import { usersFields } from './schema'

const publicUserSchema = z.object(usersFields).nullable()

const userBySchema = z.union([
  z.object({ id: zid('users') }),
  z.object({ tokenIdentifier: z.string() }),
])

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
    return publicUserSchema.parse(user)
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

//* API Key
export const generateApiKey = internalMutation({
  args: {
    id: zid('users'),
  },
  handler: async (ctx, { id }) => {
    const key = generateRandomString(32)
    await ctx
      .table('users')
      .getX(id)
      .patch({ apiKey: `esk_${key}` })
  },
})
