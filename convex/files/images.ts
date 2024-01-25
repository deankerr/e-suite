import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { Doc, Id } from '../_generated/dataModel'
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from '../_generated/server'
import { nsfwRatings } from '../constants'
import { vEnum } from '../util'

const imagesFields = {
  storageId: v.id('_storage'),
  generationsId: v.optional(v.id('generations')),
  sourceUrl: v.string(),
  nsfw: vEnum(nsfwRatings),

  width: v.number(),
  height: v.number(),
  blurDataURL: v.string(),
  color: v.string(),
  metadata: v.any(),

  deleted: v.boolean(),
}

export const imagesTable = defineTable(imagesFields).index('by_sourceUrl', ['sourceUrl'])

export const getBySourceUrl = internalQuery({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    const sourceUrl = new URL(url).toString()
    const image = await ctx.db
      .query('images')
      .withIndex('by_sourceUrl', (q) => q.eq('sourceUrl', sourceUrl))
      .unique()
    return image
  },
})

export const pull = action({
  args: {
    url: v.string(),
    generationsId: v.optional(v.id('generations')),
    nsfw: v.optional(vEnum(nsfwRatings)),
  },
  handler: async (ctx, { url, generationsId, nsfw = 'unknown' }): Promise<Id<'images'> | null> => {
    const existing = await ctx.runQuery(internal.files.images.getBySourceUrl, { url })
    if (existing) return existing._id

    const sourceUrl = new URL(url).toString()

    const response = await fetch(sourceUrl)
    const blob = await response.blob()
    const storageId = await ctx.storage.store(blob)

    const metadata = await ctx.runAction(internal.files.plaiceholder.process, { storageId })
    const imageId = await ctx.runMutation(internal.files.images.create, {
      ...metadata,
      storageId,
      sourceUrl,
      nsfw,
      generationsId,
    })

    return imageId
  },
})

export const create = internalMutation({
  args: {
    ...imagesFields,
    deleted: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('images', {
      ...args,
      deleted: false,
    })
  },
})

export const update = internalMutation(
  async (ctx, { fields }: { fields: Partial<Doc<'images'>> }) => {
    if (!fields._id) return
    await ctx.db.patch(fields._id, { ...fields })
  },
)
