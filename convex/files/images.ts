import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internalAction, internalMutation } from '../_generated/server'
import { nsfwRatings } from '../constants'
import { vEnum } from '../util'

const imagesCreateFields = {
  sourceUrl: v.string(),
  sourceInfo: v.string(),
  generationsId: v.optional(v.id('generations')),
  width: v.number(),
  height: v.number(),
}

const imagesFields = {
  ...imagesCreateFields,

  storageId: v.id('_storage'),
  url: v.string(),
  nsfw: vEnum(nsfwRatings),
}

export const imagesTable = defineTable(imagesFields).index('by_sourceUrl', ['sourceUrl'])

export const create = internalMutation({
  args: {
    ...imagesFields,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('images', args)
    return id
  },
})

export const download = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    const sourceUrl = new URL(url).toString()
    const response = await fetch(sourceUrl)
    const blob = await response.blob()
    const storageId = await ctx.storage.store(blob)
    return storageId
  },
})
