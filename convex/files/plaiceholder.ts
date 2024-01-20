'use node'

import { Buffer } from 'node:buffer'
import { v } from 'convex/values'
import { getPlaiceholder } from 'plaiceholder'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

export const generate = internalAction({
  args: {
    id: v.id('images'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { id, storageId }) => {
    console.log('run blur')
    const blob = await ctx.storage.get(storageId)
    assert(blob, 'Invalid storageId', { storageId })
    const buffer = Buffer.from(await blob.arrayBuffer())
    const dat = await getPlaiceholder(buffer)

    await ctx.runMutation(internal.files.images.updateBlurData, {
      id: id as Id<'images'>,
      blurData: dat,
    })
  },
})
