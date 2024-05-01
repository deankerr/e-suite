import * as falClient from '@fal-ai/serverless-client'
import { zid } from 'convex-helpers/server/zod'
import * as R from 'remeda'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction } from '../functions'
import { generationFields } from '../schema'

falClient.config({
  credentials: process.env.FAL_API_KEY!,
})

const falImageSchema = z.object({
  file_size: z.number().optional(),
  height: z.number(),
  file_name: z.string().optional(),
  content_type: z.string(),
  url: z.string(),
  width: z.number(),
})

const falResponseSchema = z.object({
  images: z.array(falImageSchema),
  seed: z.number(),
  has_nsfw_concepts: z.array(z.boolean()),
  prompt: z.string().optional(),
  timings: z.record(z.string(), z.number()).optional(),
})

export const textToImage = async ({
  parameters,
  n,
}: {
  parameters: Record<string, any>
  n: number
}) => {
  try {
    const input = {
      prompt: parameters.prompt,
      num_images: n,
      enable_safety_checker: false,
      expand_prompt: true,
      image_size: 'landscape_16_9',
      num_inference_steps: parameters.steps,
    }

    console.log('[fal/textToImage] >>>', input)

    const response = await falClient.subscribe('fal-ai/hyper-sdxl', {
      input,
      logs: true,
      onEnqueue: () => console.log('enqueued'),
    })

    console.log('[fal/textToImage] <<<', response)

    const result = falResponseSchema.parse(response)

    return {
      result: {
        images: result.images.map((image) => image.url),
      },
      error: null,
    }
  } catch (err) {
    if (err instanceof falClient.ApiError) {
      console.error(err, err.body)
      const detail =
        typeof err.body?.detail === 'string'
          ? err.body?.detail
          : JSON.stringify(err.body?.detail ?? {})
      return {
        result: { images: [] },
        error: {
          message: `${err.name}: ${err.message} - ${detail}`,
          noRetry: true,
        },
      }
    }

    console.error(err)

    if (err instanceof Error) {
      return {
        result: { images: [] },
        error: {
          message: `${err.name}: ${err.message}`,
          noRetry: true,
        },
      }
    }

    return {
      result: { images: [] },
      error: {
        message: 'Unkonwn error',
        noRetry: true,
      },
    }
  }
}

export const fal = {
  textToImage,
}

export const faltextToImage = internalAction({
  args: {
    generationIds: zid('generations').array(),
    parameters: z.object(generationFields),
  },
  handler: async (ctx, { generationIds, parameters }) => {
    const input = {
      parameters,
      n: generationIds.length,
    }

    const { result, error } = await fal.textToImage(input)

    // returned error = task failed successfully (no retry)
    if (error) {
      await Promise.all(
        generationIds.map(
          async (generationId) =>
            await ctx.runMutation(internal.generation.result, {
              generationId,
              result: { type: 'error', message: error.message },
            }),
        ),
      )
      return
    }

    const pairs = R.zip(generationIds, result.images)
    await Promise.all(
      pairs.map(
        async ([generationId, url]) =>
          await ctx.runMutation(internal.generation.result, {
            generationId,
            result: { type: 'url', message: url },
          }),
      ),
    )
  },
})
