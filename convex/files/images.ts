import { v } from 'convex/values'
import { internalMutation, internalQuery } from '../functions'
import { imagesFields, permissions } from '../schema'
import { Ent } from '../types'

export const get = internalQuery({
  args: {
    id: v.id('images'),
  },
  handler: async (ctx, { id }): Promise<Ent<'images'>> => await ctx.table('images').getX(id),
})

export const create = internalMutation({
  args: {
    ...imagesFields,
    width: v.number(),
    height: v.number(),
    permissions: v.optional(permissions),
  },
  handler: async (ctx, args) => {},
})
