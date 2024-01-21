import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction, internalMutation, internalQuery } from '../_generated/server'
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

export const imagesTable = defineTable(imagesFields)

export const pull = internalAction({
  args: {
    url: v.string(),
    generationsId: v.optional(v.id('generations')),
    nsfw: v.optional(vEnum(nsfwRatings)),
  },
  handler: async (ctx, { url, generationsId, nsfw = 'unknown' }) => {
    const sourceUrl = new URL(url).toString()
    const response = await fetch(sourceUrl)
    const blob = await response.blob()
    const storageId = await ctx.storage.store(blob)

    const metadata = await ctx.runAction(internal.files.plaiceholder.process, { storageId })
    const imageId: Id<'images'> = await ctx.runMutation(internal.files.images.create, {
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
