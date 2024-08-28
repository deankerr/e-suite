import * as fal from '@fal-ai/serverless-client'
import { generateObject } from 'ai'
import { omit } from 'convex-helpers'
import { v } from 'convex/values'
import * as vb from 'valibot'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { createApi } from '../lib/ai'
import { ENV } from '../lib/env'
import { defaultSizes } from '../shared/defaults'

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

    const { modelId = 'fal-ai/flux/dev', workflow, width, height, n, ...rest } = runConfig

    const input = {
      ...rest,
      image_size:
        workflow === 'guided' || !width || !height
          ? await generateDimensions({ prompt: rest.prompt, resourceKey: 'openai::gpt-4o-mini' })
          : {
              width,
              height,
            },
      num_images: n,
      enable_safety_checker: false,
    }

    let model = modelId
    if (modelId === 'fal-ai/flux/dev' && input?.loras && input.loras.length > 0) {
      model = 'fal-ai/flux-lora'
    }

    console.log('input', model, input)

    const response = await fal.subscribe(model, {
      input,
    })
    console.log('response', response)
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

const generateDimensions = async (args: { prompt?: string; resourceKey: string }) => {
  const fallback = {
    width: 512,
    height: 512,
  }

  if (!args.prompt) return fallback

  const { model } = createApi(args.resourceKey)

  const response = await generateObject({
    model,
    system:
      'You will be given a prompt that has been entered by a user for image generation. Respond with a JSON object containing a recommended dimensions for the image, being square, portrait, or landscape. If it is unclear what the user is asking for, use your best judgement to choose the most appropriate dimensions.',
    schema: z.object({
      dimensions: z
        .enum(['square', 'portrait', 'landscape'])
        .describe('The recommended dimensions for the image.'),
    }),
    messages: [
      {
        role: 'user',
        content: args.prompt,
      },
    ],
  })

  const result = omit(response, ['rawResponse', 'toJsonResponse'])
  console.log(result)

  return defaultSizes.find((size) => size.name === result.object.dimensions) ?? fallback
}
