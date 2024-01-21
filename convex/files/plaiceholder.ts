'use node'

import { Buffer } from 'node:buffer'
import { v } from 'convex/values'
import { getPlaiceholder } from 'plaiceholder'
import { internalAction } from '../_generated/server'
import { assert } from '../util'

export const process = internalAction({
  args: {
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { storageId }) => {
    const blob = await ctx.storage.get(storageId)
    assert(blob, 'Invalid storageId', { storageId })
    const buffer = Buffer.from(await blob.arrayBuffer())

    const {
      color: { hex: color },
      base64,
      metadata: { width, height, ...metadata },
    } = await getPlaiceholder(buffer)

    return {
      color,
      blurDataURL: base64,
      width,
      height,
      metadata,
    }
  },
})
