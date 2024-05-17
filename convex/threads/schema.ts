import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { imageGenerationSizes } from '../constants'
import { zTruncate } from '../validators'

export type GenerationParameters = z.infer<typeof generationParameters>

export const messageRolesEnum = z.enum(['system', 'assistant', 'user'])

export const generationParameters = z.object({
  prompt: z.string(),
  size: z.enum([...imageGenerationSizes, 'custom']), //?
  width: z.number(),
  height: z.number(),
  n: z.number(),

  model_id: z.string(),
  loras: z
    .object({
      id: z.string(),
      weight: z.number(),
    })
    .optional(),

  entries: z.tuple([z.string(), z.union([z.string(), z.number(), z.boolean()])]).array(),
})

export const completionParameters = z.object({
  model: z.string(),
  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
  stream: z.boolean().optional(),
})

export const inferenceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('chat-completion'),
    endpoint: z.string(),
    parameters: completionParameters,
  }),
  z.object({
    type: z.literal('text-to-image'),
    endpoint: z.string(),
    parameters: generationParameters,
  }),
])

export const filesListSchema = z.object({ type: z.enum(['image']), id: zid('images') }).array()

export const messageFields = {
  role: messageRolesEnum,
  name: zTruncate(64).optional(),
  text: z.string().optional(),
  content: z.string().optional(),

  inference: inferenceSchema.optional(),
  files: filesListSchema.optional(),

  metadata: z.string().array().array().optional(),
  speechId: zid('speech').optional(),
}

export const threadFields = {
  title: zTruncate(256).optional(),
}
