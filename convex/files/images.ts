import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { internalMutation, query } from '../_generated/server'
import { nsfwRatings } from '../constants'
import { vEnum } from '../util'

export const imagesFields = {
  sourceUrl: v.string(),
  sourceInfo: v.string(),
  source: v.optional(
    v.object({
      storageId: v.id('_storage'),
      width: v.number(),
      height: v.number(),
      nsfw: vEnum(nsfwRatings),
    }),
  ),
}

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

export const fromUrl = internalMutation({
  args: {
    url: v.string(),
    sourceInfo: v.string(),
  },
  handler: async (ctx, { url, sourceInfo }) => {
    const sourceUrl = new URL(url).toString()
    const image = await ctx.db
      .query('images')
      .filter((q) => q.eq(q.field('sourceUrl'), sourceUrl))
      .unique()
    if (image) return image._id

    //* create imageStore record
    const newImageId = await ctx.db.insert('images', { sourceUrl, sourceInfo })
    await ctx.scheduler.runAfter(0, internal.files.imagesLib.processImage, { id: newImageId })
    return newImageId
  },
})

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
