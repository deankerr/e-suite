import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { internalAction, internalMutation, internalQuery } from '../_generated/server'
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
  blurDataUrl: v.optional(v.string()),
  blurData: v.optional(v.any()),
}

export const imagesTable = defineTable(imagesFields).index('by_sourceUrl', ['sourceUrl'])

export const create = internalMutation({
  args: {
    ...imagesFields,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('images', args)
    await ctx.scheduler.runAfter(0, internal.files.blurDataUrl.generate, {
      id,
      storageId: args.storageId,
    })
    return id
  },
})

export const updateBlurDataUrl = internalMutation({
  args: {
    id: v.id('images'),
    blurDataUrl: v.string(),
  },
  handler: async (ctx, { id, blurDataUrl }) => {
    await ctx.db.patch(id, { blurDataUrl })
  },
})

export const updateBlurData = internalMutation({
  args: {
    id: v.id('images'),
    blurData: v.any(),
  },
  handler: async (ctx, { id, blurData }) => {
    await ctx.db.patch(id, { blurData })
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
