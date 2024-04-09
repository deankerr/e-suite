import { ConvexError } from 'convex/values'
import ky from 'ky'
import { z } from 'zod'

import { getEnv } from '../lib/utils'

import type { generationParametersSchema } from '../schema'

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

export const textToImage = async ({
  parameters,
  dimensions,
}: {
  parameters: z.infer<typeof generationParametersSchema>
  dimensions: { width: number; height: number; n: number }
}) => {
  const body = new URLSearchParams()

  for (const [key, value] of Object.entries(parameters)) {
    body.set(translateKey(key), String(value))
  }

  for (const [key, value] of Object.entries(dimensions)) {
    body.set(translateKey(key), String(value))
  }

  body.set('access_token', getEnv('SINKIN_API_KEY'))

  console.log(body)
  const response = await api
    .post('inference', {
      body,
    })
    .json()
  console.log('[sinkin/textToImage]', response)

  const generation = textToImageResponseSchema.safeParse(response)
  if (generation.success) {
    return generation.data
  }

  const error = textToImageErrorResponseSchema.safeParse(response)
  if (error.success) {
    throw new ConvexError({ ...error.data })
  }

  throw new ConvexError({ message: 'Invalid response', response: JSON.stringify(response) })
}

export const sinkin = {
  textToImage,
}

const textToImageResponseSchema = z.object({
  inf_id: z.string(),
  credit_cost: z.number(),
  images: z.string().array(),
})

const textToImageErrorResponseSchema = z.object({
  error_code: z.number(),
  message: z.string(),
})

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
