import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { internalMutation, internalQuery } from '../functions'
import { imagesFields, permissions } from '../schema'
import { assert } from '../util'

export type StoredImage = Awaited<ReturnType<typeof get>>

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
    await ctx.scheduler.runAfter(0, internal.files.process.downloadImage, {
      imageId: id,
      sourceUrl,
    })
  },
})

export const addStorageResults = internalMutation({
  args: {
    id: v.id('images'),
    storageId: v.id('_storage'),
    width: v.number(),
    height: v.number(),
    blurDataURL: v.string(),
    color: v.string(),
    metadata: v.any(),
  },
  handler: async (ctx, { id, ...results }) => await ctx.table('images').getX(id).patch(results),
})
