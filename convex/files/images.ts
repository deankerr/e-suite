import { defineTable } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction, internalMutation, internalQuery, query } from '../_generated/server'
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
      url: v.string(),
    }),
  ),
}

const imagesCreateFields = {
  sourceUrl: v.string(),
  sourceInfo: v.string(),
  generationsId: v.id('generations'),
  width: v.number(),
  height: v.number(),
}

const newimagesFields = {
  ...imagesCreateFields,

  storageId: v.id('_storage'),
  url: v.string(),
  nsfw: vEnum(nsfwRatings),
}

export const imagesTable = defineTable(newimagesFields).index('by_sourceUrl', ['sourceUrl'])

export const create = internalMutation({
  args: {
    ...newimagesFields,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('images', args)
    return id
  },
})

const storeGeneration = internalAction({
  args: {
    ...imagesCreateFields,
  },
  handler: async (ctx, generation) => {
    const sourceUrl = new URL(generation.sourceUrl).toString()
    const response = await fetch(sourceUrl)
    const blob = await response.blob()
    const storageId = await ctx.storage.store(blob)
    const url = await ctx.storage.getUrl(storageId)
    if (!url) throw new ConvexError({ message: 'unable to get storage url', storageId, sourceUrl })

    return await ctx.runMutation(internal.files.images.create, {
      ...generation,
      sourceUrl,
      storageId,
      url,
      nsfw: 'unknown',
    })
  },
})

const storeGenerations = internalAction({
  args: {
    generations: v.array(v.object(imagesCreateFields)),
  },
  handler: async (ctx, { generations }) => {
    const fetches = await Promise.all(
      generations.map(async (generation) => {
        try {
          const sourceUrl = new URL(generation.sourceUrl).toString()
          const response = await fetch(sourceUrl)
          const blob = await response.blob()
          const storageId = await ctx.storage.store(blob)
          const url = await ctx.storage.getUrl(storageId)
          if (!url)
            throw new ConvexError({ message: 'unable to get storage url', storageId, sourceUrl })

          return await ctx.runMutation(internal.files.images.create, {
            ...generation,
            sourceUrl,
            storageId,
            url,
            nsfw: 'unknown',
          })
        } catch (err) {
          console.error(err)
          return { error: err }
        }
      }),
    )

    return fetches
  },
})

//TODO remove
// export const fromUrl = internalMutation({
//   args: {
//     sourceUrl: v.string(),
//     sourceInfo: v.string(),
//   },
//   handler: async (ctx, { sourceUrl, sourceInfo }) => {
//     // const sourceUrl = new URL(url).toString()
//     // const image = await ctx.db
//     //   .query('images')
//     //   .withIndex('by_sourceUrl', (q) => q.eq('sourceUrl', sourceUrl))
//     //   .unique()
//     // if (image) return image._id

//     // //* create imageStore record
//     // const newImageId = await ctx.db.insert('images', { sourceUrl, sourceInfo })
//     // await ctx.scheduler.runAfter(0, internal.files.imagesLib.processImage, { id: newImageId })
//     // return newImageId
//     return 'dfsf' as Id<'images'>
//   },
// })

// export const updateStorage = internalMutation({
//   args: {
//     id: v.id('images'),
//     source: imagesFields.source,
//   },
//   handler: async (ctx, { id, source }) => {
//     await ctx.db.patch(id, { source })
//   },
// })
