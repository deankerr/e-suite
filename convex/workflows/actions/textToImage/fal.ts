import * as client from '@fal-ai/serverless-client'
import * as vb from 'valibot'

import { ResourceKey } from '../../../lib/valibot'
import { WorkflowError } from '../../helpers'

import type { RunConfigTextToImage } from '../../../types'

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

client.config({
  credentials: process.env.FAL_API_KEY!,
})

export const textToImage = async (
  args: Omit<RunConfigTextToImage, 'type' | 'size'> & { size?: string },
) => {
  try {
    const { resourceKey, width, height, size, prompt, n } = args
    const { modelId } = vb.parse(ResourceKey, resourceKey)

    const input = {
      prompt,
      image_size: width && height ? { width, height } : size,
      num_images: n,

      prompt_expansion: false,
      expand_prompt: false,
      enable_safety_checker: false,
    }

    console.log('textToImage.fal.input', modelId, input)
    const response = await client.subscribe(modelId, {
      input,
    })
    console.log('textToImage.fal.output', response)

    const output = vb.parse(Response, response)
    return { imageUrls: output.images.map((i) => i.url), output }
  } catch (err) {
    // * error handling
    console.error(err)
    if (err instanceof client.ValidationError || err instanceof client.ApiError) {
      throw new WorkflowError(
        `${err.name}: ${JSON.stringify(err.body.detail)}`,
        'endpoint_error',
        true,
        err.body.detail,
      )
    }

    throw err
  }
}
