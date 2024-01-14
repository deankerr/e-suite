'use node'

import { v } from 'convex/values'
import imagesize from 'image-size'
import { internal } from './_generated/api'
import { Id } from './_generated/dataModel'
import { action, internalMutation } from './_generated/server'

const maxUploadBytes = 20 * 1024 * 1024

const allowedImageFormats = ['bmp', 'gif', 'heic', 'jpeg', 'jpg', 'png', 'tiff', 'webp'] as const

export const createImageFromUrl = action({
  args: {
    url: v.string(),
  },
  handler: async (ctx, { url }) => {
    try {
      const response = await fetch(new URL(url))
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      const contentType = response.headers.get('Content-Type')

      const blob = await response.blob()
      const metadata = imagesize(new Uint8Array(await blob.arrayBuffer()))
      console.log(`upload: ${kb(blob.size)}kb "${contentType}"`, metadata)

      if (blob.size > maxUploadBytes)
        throw new Error(`max upload size exceeded ${kb(blob.size)}kb / ${kb(maxUploadBytes)}`)
      if (!allowedImageFormats.find((f) => f === metadata.type))
        throw new Error(`invalid file format: "${metadata.type}"`)

      //todo first queue in mutation
      const storeId = await ctx.storage.store(blob)
      console.log('storeId', storeId)
      await ctx.runMutation(internal.fileTable.addTempTableFile, { fileId: storeId })
      //todo record results
    } catch (err) {
      throw err
    }
  },
})

const kb = (bytes: number) => Math.floor(bytes / 1024)
