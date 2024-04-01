import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { internalMutation, internalQuery, query } from './functions'
import { usersFields } from './schema'

const publicUserSchema = z.object(usersFields).nullable()

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
    by: z.union([z.object({ id: zid('users') }), z.object({ tokenIdentifier: z.string() })]),
    fields: z.object(usersFields).partial(),
  },
  handler: async (ctx, { by, fields }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).patch(fields)
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).patch(fields)
  },
})

export const remove = internalMutation({
  args: {
    by: z.union([z.object({ id: zid('users') }), z.object({ tokenIdentifier: z.string() })]),
  },
  handler: async (ctx, { by }) => {
    if ('id' in by) return await ctx.table('users').getX(by.id).delete()
    return await ctx.table('users').getX('tokenIdentifier', by.tokenIdentifier).delete()
  },
})
