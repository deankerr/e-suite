import * as fal from '@fal-ai/serverless-client'
import { v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob } from '../jobs'
import { insist } from '../shared/utils'

fal.config({
  credentials: process.env.FAL_API_KEY!,
})

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.imageId, 'required: imageId', { code: 'invalid_job', fatal: true })
    const imageId = job.imageId
    const image = await ctx.skipRules.table('images').getX(imageId)

    const modelId = image.captionModelId
    insist(modelId, 'required: modelId', { code: 'invalid_job', fatal: true })

    return { job, image, modelId }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args): Promise<void> => {
    try {
      const { job, image, modelId } = await ctx.runMutation(internal.inference.captionImage.start, {
        jobId: args.jobId,
      })

      const url = await ctx.storage.getUrl(image.fileId)
      insist(url, 'required: url', { code: 'invalid_job', fatal: true })

      console.log('[caption]', modelId, url)
      const result = await fal.subscribe(modelId, {
        input: {
          image_url: url,
          prompt:
            "What's in this image? Caption everything you see in great detail. If it has text, do an OCR and extract all of it.",
        },
      })

      const { output } = z
        .object({
          output: z.string(),
        })
        .parse(result)

      console.log('[caption]', output)

      await ctx.runMutation(internal.inference.captionImage.complete, {
        jobId: job._id,
        imageId: image._id,
        text: output,
        modelId,
      })
    } catch (err) {
      if (err instanceof fal.ApiError) {
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
    text: v.string(),
    modelId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.table('images').getX(args.imageId).patch({
      captionText: args.text,
      captionModelId: args.modelId,
    })

    await completeJob(ctx, args)
  },
})
