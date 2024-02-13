import { v } from 'convex/values'
import { internalMutation, internalQuery } from '../functions'
import { imagesFields, permissions } from '../schema'
import { assert } from '../util'

export const get = internalQuery({
  args: {
    id: v.id('images'),
  },
  handler: async (ctx, { id }) => await ctx.table('images').getX(id),
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

export const addSourceUrl = internalMutation({
  args: {
    id: v.id('images'),
    sourceUrl: v.string(),
  },
  handler: async (ctx, { id, sourceUrl }) => {
    const image = await ctx.table('images').getX(id)
    assert(!image.sourceUrl, 'Image already has a source url')

    await image.patch({ sourceUrl })
  },
})
