import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

const blurDataEndpoint = process.env.APP_BLURDATA_ENDPOINT!
const blurDataKey = process.env.APP_BLURDATA_KEY!

export const generate = internalAction({
  args: {
    id: v.id('images'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { id, storageId }) => {
    const imageUrl = await ctx.storage.getUrl(storageId)
    assert(imageUrl, 'Invalid storageId')
    const response = await fetch(blurDataEndpoint, {
      method: 'POST',
      body: JSON.stringify([imageUrl]),
      headers: { Authorization: blurDataKey },
    })
    const json = await response.json()

    await ctx.runMutation(internal.files.images.updateBlurData, {
      id: id as Id<'images'>,
      blurData: json,
    })
  },
})
