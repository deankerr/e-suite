'use node'

import { Buffer } from 'node:buffer'
import { v } from 'convex/values'
import ky from 'ky'
import { getPlaiceholder } from 'plaiceholder'

import { internal } from '../_generated/api'
import { internalAction } from '../_generated/server'

export const downloadImage = internalAction({
  args: {
    imageId: v.id('images'),
    sourceUrl: v.string(),
  },
  handler: async (ctx, { imageId, sourceUrl }) => {
    try {
      const response = await ky.get(sourceUrl)
      const blob = await response.blob()
      const storageId = await ctx.storage.store(blob)

      const data = await process(Buffer.from(await blob.arrayBuffer()))

      await ctx.runMutation(internal.files.images.addStorageResults, {
        ...data,
        storageId,
        id: imageId,
      })
    } catch (err) {
      const event = {
        type: 'downloadImage' as const,
        imageId,
        status: 'error' as const,
        message: err instanceof Error ? `${err.name}: ${err.message}` : 'Unknown error',
      }
      await ctx.runMutation(internal.jobs.event, event)
      throw err
    }
  },
})

const process = async (buffer: Buffer) => {
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
    metadata: {
      ...metadata,
      exif: metadata.exif ? metadata.exif.buffer : undefined,
      icc: undefined,
      formatMagick: undefined,
      iptc: metadata.iptc ? metadata.iptc.buffer : undefined,
      xmp: metadata.xmp ? metadata.xmp.buffer : undefined,
    },
  }
}
