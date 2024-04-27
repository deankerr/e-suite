import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { z } from 'zod'

import {
  completionProviders,
  generationProviders,
  maxMessageNameStringLength,
  maxTitleStringLength,
  messageRoles,
  ridLength,
} from './constants'

// const timeToDelete = 1000 * 60 * 60 * 24
const timeToDelete = 5000

export const ridField = z.string().length(ridLength)

export const generatedImageFields = {
  width: z.number(),
  height: z.number(),

  sourceUrl: z.string(),
  sourceFileId: zid('_storage'),

  // optimized
  fileId: zid('_storage'),

  blurDataUrl: z.string(),
  color: z.string(),
}
const generated_images = defineEnt(zodToConvexFields(generatedImageFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('generation', { field: 'generationId' })

export const generationResultField = z.object({
  type: z.enum(['url', 'error']),
  message: z.string(),
})

export const generationFields = {
  result: generationResultField.optional(),

  provider: z.enum(generationProviders),
  metadata: z.tuple([z.string(), z.string()]).array().optional(),

  // common
  model_id: z.string(),
  width: z.number().min(512).max(2048),
  height: z.number().min(512).max(2048),
  prompt: z.string(),
  seed: z.number(),

  // common optional
  negative_prompt: z.string().optional(),
  guidance_scale: z.number().optional(),
  num_inference_steps: z.number().optional(),

  // sinkin
  lcm: z.boolean().optional(),
  use_default_neg: z.boolean().optional(),

  // fal
  enable_safety_checker: z.boolean().optional(),
}
export const generations = defineEnt(zodToConvexFields(generationFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('message')
  .edge('generated_image', { optional: true, ref: 'generationId' })

//* Chat/Completion
export const completionParametersSchema = z.object({
  model: z.string(),
  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
  stream: z.boolean().optional(),
})

export const chatInference = z.object({
  provider: z.enum(completionProviders),
  parameters: completionParametersSchema,
})

//* Messages
export const generationInferenceParamsSchema = z.object({
  parameters: z.object(generationFields).omit({ result: true, width: true, height: true }),
  dimensions: z
    .object({
      width: z.number().min(512).max(2048),
      height: z.number().min(512).max(2048),
      n: z.number().min(1).max(8),
    })
    .array()
    .min(1)
    .max(8),
})

export const messageFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  text: z.string().optional(),

  inference: z
    .object({
      generation: generationInferenceParamsSchema.optional(),
    })
    .optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('generations', { ref: true })
  .edge('thread')
  .edge('user')

//* Threads
export const threadFields = {
  title: z
    .string()
    .transform((value) => value.slice(0, maxTitleStringLength))
    .optional(),
}
const threads = defineEnt(zodToConvexFields(threadFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('messages', { ref: true })
  .edge('user')

//* Users
export const userFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(userFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true })
  .edges('messages', { ref: true })

export const usersApiKeysFields = {
  valid: z.boolean(),
}
const users_api_keys = defineEnt(zodToConvexFields(usersApiKeysFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', zodToConvex(z.string()), { unique: true })
  .edge('user')

//* Schema
const schema = defineEntSchema(
  {
    generations,
    generated_images,

    messages,
    threads,
    users,
    users_api_keys,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
