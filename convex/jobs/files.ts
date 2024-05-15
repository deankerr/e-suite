'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { processImage } from '../lib/sharp'
import { insist } from '../utils'

export const fetchImageToFile = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })
    insist(job.input, 'job missing input url')

    const inputBlob = await ky.get(job.input).blob()

    const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)

    const originBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
    const originFileId = await ctx.storage.store(originBlob)
    const webpStorageId = await ctx.storage.store(webpBlob)

    await ctx.runMutation(internal.images.manage.create, {
      messageId: job.messageId,
      width: metadata.width,
      height: metadata.height,
      originUrl: job.input,
      originFileId,
      fileId: webpStorageId,
      blurDataUrl,
      color,
      sourceSet: [],
      generationData: [],
    })
  },
})
