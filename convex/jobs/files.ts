'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { optimizeImage } from '../lib/sharp'

export const ingestImageUrl = internalAction({
  args: {
    jobId: zid('jobs'),
    url: z.string(),
  },
  handler: async (ctx, { jobId, url }): Promise<void> => {
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })

    const { inputBlob, webpBlob, blurDataUrl, color, width, height, format } = await optimizeImage(
      await ky.get(url).blob(),
    )

    const imageId = await ctx.runMutation(internal.images.manage.create, {
      messageId: job.messageId,
      width,
      height,
      originUrl: url,
      blurDataUrl,
      color,
      generationData: [],
    })

    const originFileId = await ctx.storage.store(inputBlob)
    await ctx.runMutation(internal.images.manage.createImageFile, {
      imageId,
      width,
      height,
      fileId: originFileId,
      format,
      isOriginFile: true,
    })

    const webpStorageId = await ctx.storage.store(webpBlob)
    await ctx.runMutation(internal.images.manage.createImageFile, {
      imageId,
      width,
      height,
      fileId: webpStorageId,
      format: 'webp',
      isOriginFile: false,
    })

    await ctx.runMutation(internal.jobs.manage.results, {
      jobId: job._id,
      status: 'complete',
      results: [{ type: 'image', value: imageId }],
    })
  },
})
