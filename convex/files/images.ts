import { v } from 'convex/values'
import { api, internal } from '../_generated/api'
import { action, internalMutation, mutation, query } from '../_generated/server'

export const get = query({
  args: {
    id: v.id('images'),
  },
  handler: async (ctx, { id }) => ctx.db.get(id),
})

export const list = query(async (ctx) => {
  const images = await ctx.db.query('images').collect()
  return await Promise.all(
    images.map(async (img) => {
      const source = img?.source
        ? { ...img.source, url: await ctx.storage.getUrl(img.source.storageId) }
        : undefined

      return {
        ...img,
        source,
      }
    }),
  )
})

export const fromUrl = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    //todo normalize url
    const image = await ctx.db
      .query('images')
      .filter((q) => q.eq(q.field('sourceUrl'), url))
      .unique()
    if (image) return image._id

    //* create imageStore record
    const newImageId = await ctx.db.insert('images', { sourceUrl: url })
    await ctx.scheduler.runAfter(0, internal.files.imagesLib.processImage, { id: newImageId })
    return newImageId
  },
})

//todo refactor with schema
export const updateStorage = internalMutation({
  args: {
    id: v.id('images'),
    source: v.object({
      storageId: v.id('_storage'),
      width: v.number(),
      height: v.number(),
      nsfw: v.string(),
    }),
  },
  handler: async (ctx, { id, source }) => {
    await ctx.db.patch(id, { source })
  },
})
