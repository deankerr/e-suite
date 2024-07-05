import * as falClient from '@fal-ai/serverless-client'
import { v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { createFalClient } from '../endpoints/fal'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobsNext'
import { insist } from '../shared/utils'

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.imageId, 'required: imageId', { code: 'invalid_job', fatal: true })
    const imageId = job.imageId
    const image = await ctx.skipRules.table('images').getX(imageId)
    const imageFile = await ctx.skipRules
      .table('files', 'imageId', (q) => q.eq('imageId', imageId))
      .firstX()

    return { job, image, imageFile }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args): Promise<void> => {
    try {
      const { job, image, imageFile } = await ctx.runMutation(internal.inference.assessNsfw.start, {
        jobId: args.jobId,
      })

      const url = await ctx.storage.getUrl(imageFile.fileId)
      insist(url, 'required: url', { code: 'invalid_job', fatal: true })

      console.log('[nsfw]', url)
      const fal = createFalClient()

      const result = await fal.subscribe('fal-ai/imageutils/nsfw', {
        input: {
          image_url: url,
        },
      })

      const { nsfw_probability } = z
        .object({
          nsfw_probability: z.number(),
        })
        .parse(result)

      console.log('[nsfw]', nsfw_probability)

      await ctx.runMutation(internal.inference.assessNsfw.complete, {
        jobId: job._id,
        imageId: image._id,
        nsfwProbability: nsfw_probability,
      })
    } catch (err) {
      if (err instanceof falClient.ApiError) {
        const detail =
          typeof err.body?.detail === 'string'
            ? err.body?.detail
            : JSON.stringify(err.body?.detail ?? {})

        console.error({
          message: `${err.name}: ${err.message} - ${detail}`,
          noRetry: true,
        })
      } else if (err instanceof Error) {
        console.error({
          message: `${err.name}: ${err.message}`,
        })
      }

      throw err
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    imageId: v.id('images'),
    nsfwProbability: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.table('images').getX(args.imageId).patch({
      nsfwProbability: args.nsfwProbability,
    })

    await completeJob(ctx, args)
  },
})
