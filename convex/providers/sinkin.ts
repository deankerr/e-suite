import ky from 'ky'
import { z } from 'zod'

import { imageGenerationSizesMap } from '../constants'
import { getEnv } from '../utils'

import type { generationParameters } from '../schema'
import type { TextToImageHandler } from './types'

const api = ky.extend({
  prefixUrl: 'https://sinkin.ai/m',
  timeout: 1000 * 60,
  retry: 0,
})

export const textToImage: TextToImageHandler = async ({
  parameters,
  n,
}: {
  parameters: z.infer<typeof generationParameters>
  n: number
}) => {
  const { size, entries, model_id, prompt } = parameters
  const { width, height } = imageGenerationSizesMap[size]

  const body = new URLSearchParams()

  for (const [key, value] of entries) {
    body.set(key, String(value))
  }
  body.set('width', width.toString())
  body.set('height', height.toString())
  body.set('model_id', model_id)
  body.set('prompt', prompt)

  body.set('num_images', String(n))

  body.set('access_token', getEnv('SINKIN_API_KEY'))

  console.log('[sinkin/textToImage] >>>', [...body.entries()])
  const response = await api
    .post('inference', {
      body,
    })
    .json()
  console.log('[sinkin/textToImage] <<<', response)

  const parsedResponse = textToImageResponseSchema.safeParse(response)
  if (!parsedResponse.success) {
    return {
      error: {
        message: 'response validation failed',
        data: parsedResponse.error.issues,
      },
      result: null,
    }
  }

  if ('images' in parsedResponse.data) {
    const { images, ...rest } = parsedResponse.data
    return {
      result: { ...rest, urls: images },
      error: null,
    }
  }

  // prompt rejection error
  if (parsedResponse.data.error_code === 41) {
    return {
      error: {
        message: parsedResponse.data.message,
        noRetry: true,
        data: parsedResponse.data,
      },
      result: null,
    }
  }

  return {
    error: {
      message: 'endpoint returned error',
      response: JSON.stringify(response),
    },
    result: null,
  }
}

export const sinkin = {
  textToImage,
}

const textToImageResponseSchema = z.union([
  z.object({
    inf_id: z.string(),
    credit_cost: z.number(),
    error_code: z.number(),
    images: z.string().array(),
  }),
  z.object({
    error_code: z.number(),
    message: z.string(),
  }),
])

// const apiGetModelsResponseSchema = z.object({
//   error_code: z.number(),
//   models: z
//     .object({
//       civitai_model_id: z
//         .number()
//         .transform((id) => String(id))
//         .optional(),
//       cover_img: z.string(),
//       id: z.string(),
//       link: z.string(),
//       name: z.string(),
//       tags: z.string().array().optional(),
//     })
//     .array(),
//   loras: z
//     .object({
//       cover_img: z.string(),
//       id: z.string(),
//       link: z.string(),
//       name: z.string(),
//     })
//     .array(),
//   message: z.string().optional(),
// })
