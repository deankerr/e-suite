import * as client from '@fal-ai/serverless-client'
import { z } from 'zod'

import type { RunConfigTextToImage } from '../../types'

client.config({
  credentials: process.env.FAL_API_KEY!,
})

export const fal_textToImage = async (
  args: Omit<RunConfigTextToImage, 'type' | 'size'> & { size?: string },
) => {
  try {
    const { resourceKey, width, height, size, prompt, n } = args
    const modelId = z
      .string()
      .startsWith('fal::')
      .transform((s) => s.split('::')[1])
      .parse(resourceKey)

    const input = {
      prompt,
      image_size: width && height ? { width, height } : size,
      num_images: n,

      prompt_expansion: false,
      expand_prompt: false,
      enable_safety_checker: false,
    }
    console.log('[textToImage] [fal] [input]', modelId, input)

    const response = await client.subscribe(modelId, {
      input,
    })
    console.log('[textToImage] [fal] [output]', response)

    const { images } = z
      .object({
        images: z
          .object({
            url: z.string(),
          })
          .array(),
      })
      .parse(response)

    return { imageUrls: images.map((i) => i.url) }
  } catch (err) {
    console.error(err)

    throw err
  }
}
