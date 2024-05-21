'use node'

import { zid } from 'convex-helpers/server/zod'
import sharp from 'sharp'
import { z } from 'zod'

import { internalAction } from '../functions'

export const resizeToWebpBuffer = internalAction({
  args: {
    originFileId: zid('_storage'),
    width: z.number(),
  },
  handler: async (ctx, args) => {
    try {
      const inputBlob = await ctx.storage.get(args.originFileId)
      if (!inputBlob) return null

      const buffer = await sharp(await inputBlob.arrayBuffer())
        .webp()
        .resize({ width: args.width })
        .toBuffer()

      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ) as ArrayBuffer
      return arrayBuffer
    } catch (err) {
      console.error(err)
      return null
    }
  },
})
