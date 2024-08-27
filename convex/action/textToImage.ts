import * as fal from '@fal-ai/serverless-client'
import { v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { ENV } from '../lib/env'
import { ResourceKey } from '../lib/valibot'

import type { RunConfigTextToImage } from '../types'

const Response = vb.object({
  images: vb.array(
    vb.object({
      url: vb.pipe(vb.string(), vb.url()),
      width: vb.number(),
      height: vb.number(),
      content_type: vb.string(),
    }),
  ),
  timings: vb.optional(
    vb.object({
      inference: vb.optional(vb.number()),
    }),
  ),
  seed: vb.optional(vb.number()),
  has_nsfw_concepts: vb.optional(vb.array(vb.boolean())),
  prompt: vb.optional(vb.string()),
})

fal.config({
  credentials: ENV.FAL_API_KEY,
})

export const run = internalAction({
  args: {
    generationId: v.id('generations_v1'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await ctx.runMutation(internal.db.generations.activate, {
      generationId,
    })
    const runConfig = generation.input as RunConfigTextToImage
    console.log('runConfig', runConfig)

    const { resourceKey, n, width, height, ...input } = runConfig
    const { modelId } = vb.parse(ResourceKey, resourceKey)

    const response = await fal.subscribe(modelId, {
      input: {
        ...input,
        image_size: {
          width,
          height,
        },
        num_images: n,
        enable_safety_checker: false,
      },
    })

    const output = vb.parse(Response, response)

    await ctx.runMutation(internal.db.generations.complete, {
      generationId,
      output,
      results: output.images.map((image) => ({
        ...image,
        type: 'image' as const,
      })),
    })
  },
})
