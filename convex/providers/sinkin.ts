import ky from 'ky'
import { z } from 'zod'

import { getEnv } from '../utils'

import type { GenerationInputParams } from '../schema'
import type { TextToImageHandler } from './types'

const api = ky.extend({
  prefixUrl: 'https://sinkin.ai/m',
  timeout: 1000 * 60 * 5,
  retry: 0,
})

const translateKey = (key: string) => {
  switch (key) {
    case 'model':
      return 'model_id'
    case 'negativePrompt':
      return 'negative_prompt'
    case 'n':
      return 'num_images'
    default:
      return key
  }
}

export const textToImage: TextToImageHandler = async ({
  parameters,
  n,
}: {
  parameters: GenerationInputParams
  n: number
}) => {
  const body = new URLSearchParams()

  for (const [key, value] of Object.entries(parameters)) {
    body.set(translateKey(key), String(value))
  }
  body.set(translateKey('n'), String(n))

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
