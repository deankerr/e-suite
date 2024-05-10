import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { z } from 'zod'

import {
  completionProviders,
  generationProviders,
  generationVoteNames,
  imageGenerationSizes,
  imageSrcsetWidths,
  maxMessageNameStringLength,
  maxTitleStringLength,
  messageRoles,
  ridLength,
} from './constants'

export type GenerationParams = z.infer<typeof generationFieldsObject>
const timeToDelete = ms('1 day')

export const ridField = z.string().length(ridLength)

// TODO migrate
const speech = defineEnt({
  jobId: v.optional(v.id('_scheduled_functions')),
  parameters: v.object({
    Engine: v.optional(v.string()),
    VoiceId: v.optional(v.string()),
    model_id: v.optional(v.string()),
    provider: v.string(),
    voice_id: v.optional(v.string()),
    voice_settings: v.optional(
      v.object({
        similarity_boost: v.float64(),
        stability: v.float64(),
      }),
    ),
  }),
  storageId: v.id('_storage'),
  text: v.string(),
  textHash: v.string(),
  voiceRef: v.string(),
})

//* Images
export const srcsetField = z
  .object({
    width: z.number().refine((val) => imageSrcsetWidths.some((width) => width === val)),
    fileId: zid('_storage'),
  })
  .array()

const sharedImageFields = {
  width: z.number(),
  height: z.number(),

  sourceUrl: z.string(),
  sourceFileId: zid('_storage'),

  // optimized
  fileId: zid('_storage'),

  blurDataUrl: z.string(),
  color: z.string(),
}

//* App Images
export const appImageFields = { ...sharedImageFields, srcset: srcsetField }
const app_images = defineEnt(zodToConvexFields(appImageFields)).index('sourceUrl', ['sourceUrl'])

//* Generated Images
export const generatedImageFields = {
  ...sharedImageFields,
  srcset: srcsetField.optional(),
}
const generated_images = defineEnt(zodToConvexFields(generatedImageFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('generation', { field: 'generationId' })

//* Generations
export const generationResultField = z.object({
  type: z.enum(['url', 'error']),
  message: z.string(),
})

export const generationFields = {
  provider: z.enum(generationProviders),
  model_id: z.string(),

  prompt: z.string(),
  size: z.enum(imageGenerationSizes),
  width: z.number(),
  height: z.number(),

  entries: z
    .tuple([z.string(), z.union([z.string(), z.number(), z.boolean()])])
    .array()
    .default([]),

  result: generationResultField.optional(),
  metadata: z.string().array().array().optional(),

  negative_prompt: z.string().optional(), //TODO remove after migration
  lcm: z.boolean().optional(), //TODO remove after migration
  steps: z.number().optional(), //TODO remove after migration
  use_default_neg: z.boolean().optional(), //TODO remove after migration
}
const generationFieldsObject = z.object(generationFields)
export const generations = defineEnt(zodToConvexFields(generationFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('message')
  .edge('generated_image', { optional: true, ref: 'generationId', deletion: 'soft' })
  .edges('generation_votes', { ref: true, deletion: 'soft' })

//* Votes
export const generationVoteFields = {
  vote: z.enum(generationVoteNames),

  userId: zid('users').optional(),
  ip: z.string().optional(),
  constituent: z.string().uuid(),
  metadata: z.any().optional(),
}
const generation_votes = defineEnt(zodToConvexFields(generationVoteFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('generation')
  .index('userId', ['userId'])
  .index('ip', ['ip'])
  .index('constituent_vote', ['constituent', 'generationId'])

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
const messageInferenceGenerationSchema = z
  .object(generationFields)
  .omit({ result: true, size: true, width: true, height: true })
  .merge(
    z.object({
      sizes: z
        .object({ size: z.enum(imageGenerationSizes), n: z.number().min(1).max(8) })
        .array()
        .min(1)
        .max(6),
    }),
  )

export const messageFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  text: z.string().optional(),

  inference: z
    .object({
      generation: messageInferenceGenerationSchema.optional(),
    })
    .optional(),

  metadata: z.string().array().array().optional(),
  speechId: zid('speech').optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('generations', { ref: true, deletion: 'soft' })
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
  .edges('messages', { ref: true, deletion: 'soft' })
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
  .edges('threads', { ref: true, deletion: 'soft' })
  .edges('messages', { ref: true })

//* API Keys
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
    app_images,

    generations,
    generated_images,
    generation_votes,

    messages,
    threads,
    users,
    users_api_keys,

    // TODO migrate
    speech,
  },
  {
    schemaValidation: false,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
