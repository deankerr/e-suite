'use node'

import { zid } from 'convex-helpers/server/zod'
import ky from 'ky'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { processImage } from '../lib/sharp'
import { insist } from '../utils'

// export const fetchImageToFile = internalAction({
//   args: {
//     jobId: zid('jobs'),
//   },
//   handler: async (ctx, { jobId }): Promise<void> => {
//     const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })
//     insist(job.input, 'job missing input url')

//     const inputBlob = await ky.get(job.input).blob()

//     const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)

//     const originBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
//     const originFileId = await ctx.storage.store(originBlob)
//     const webpStorageId = await ctx.storage.store(webpBlob)

//     await ctx.runMutation(internal.images.manage.create, {
//       messageId: job.messageId,
//       width: metadata.width,
//       height: metadata.height,
//       originUrl: job.input,
//       originFileId,
//       fileId: webpStorageId,
//       blurDataUrl,
//       color,
//       sourceSet: [],
//       generationData: [],
//     })
//   },
// })

export const createImagesFromResults = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }): Promise<void> => {
    const job = await ctx.runMutation(internal.jobs.manage.acquire, { jobId })

    const { message, jobs } = await ctx.runQuery(
      internal.threads.internal.getMessageWithJobsOfType,
      { messageId: job.messageId, jobType: 'text-to-image' },
    )
    const inference = message.inference
    insist(inference && inference.type === 'text-to-image', 'message missing parameters')

    const all = await Promise.allSettled(
      jobs
        .flatMap((job) => job.results)
        .map(async (result) => {
          if (result.type !== 'url') throw new Error('invalid result type')

          const inputBlob = await ky.get(result.value).blob()

          const { metadata, webpBlob, blurDataUrl, color } = await processImage(inputBlob)

          const originBlob = new Blob([inputBlob], { type: `image/${metadata.format}` })
          const originFileId = await ctx.storage.store(originBlob)
          const webpStorageId = await ctx.storage.store(webpBlob)

          const id = await ctx.runMutation(internal.images.manage.create, {
            messageId: job.messageId,
            width: metadata.width,
            height: metadata.height,
            originUrl: result.value,
            originFileId,
            fileId: webpStorageId,
            blurDataUrl,
            color,
            sourceSet: [],
            generationData: [],
          })

          return { type: 'image', id }
        }),
    )

    const results = all.map((result) => {
      if (result.status === 'rejected') {
        return { type: 'error' as const, value: JSON.stringify(result.reason) }
      }

      return { type: 'image' as const, value: result.value.id }
    })

    await ctx.runMutation(internal.jobs.manage.results, {
      jobId,
      status: results.some((result) => result.type === 'image') ? 'complete' : 'failed',
      results,
    })
  },
})
