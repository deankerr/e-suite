import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { z } from 'zod'

import {
  completionProviders,
  generationProviders,
  maxMessageNameStringLength,
  maxTitleStringLength,
  messageRoles,
} from './constants'

// const timeToDelete = 1000 * 60 * 60 * 24
const timeToDelete = 5000

//* Permissions
const permissionsSchema = z.object({
  public: z.boolean(),
})

//* New Generations/Images
export const generatedImagesFields = {
  width: z.number(),
  height: z.number(),

  sourceUrl: z.string(),
  sourceFileId: zid('_storage'),

  // optimized
  fileId: zid('_storage'),

  blurDataUrl: z.string(),
  color: z.string(),
}
const generated_images = defineEnt(zodToConvexFields(generatedImagesFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edge('generation')
  .edge('message')
  .field('slugId', zodToConvex(z.string()), { index: true })

export const generationFields = {
  provider: z.enum(generationProviders),
  metadata: z.tuple([z.string(), z.string()]).array().optional(),

  // common
  model_id: z.string(),
  prompt: z.string(),
  seed: z.number(),

  width: z.number(),
  height: z.number(),
  n: z.number(),

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
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edge('message')
  .edges('generated_images', { ref: true })

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
export const messageFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  content: z.string().optional(),

  permissions: permissionsSchema.optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('thread')
  .edges('generations', { ref: true })
  .edges('generated_images', { ref: true })
  .edge('user')
  .field('slugId', zodToConvex(z.string()), { index: true }) // todo unique

//* Threads
export const threadFields = {
  title: z
    .string()
    .transform((value) => value.slice(0, maxTitleStringLength))
    .optional(),

  permissions: permissionsSchema.optional(),
}
const threads = defineEnt(zodToConvexFields(threadFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .edges('messages', { ref: true })
  .edge('user')
  .field('slugId', zodToConvex(z.string()), { index: true }) // todo unique

//* Users
export const userFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(userFields))
  .deletion('scheduled', { delayMs: timeToDelete })
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
