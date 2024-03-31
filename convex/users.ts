import { zid } from 'convex-helpers/server/zod'
import z from 'zod'

import { internalMutation, query } from './functions'
import { usersFields } from './schema'

export const get = query({
  args: {
    id: zid('users'),
  },
  handler: async (ctx, { id }) => await ctx.table('users').get(id),
})

export const create = internalMutation({
  args: {
    fields: z.object(usersFields),
  },
  handler: async (ctx, { fields }) => await ctx.table('users').insert(fields),
})

export const update = internalMutation({
  args: {
    id: zid('users'),
    fields: z.object(usersFields).partial(),
  },
  handler: async (ctx, { id, fields }) => await ctx.table('users').getX(id).patch(fields),
})
