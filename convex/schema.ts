import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { z } from 'zod'

import {
  generationProviders,
  generationVoteNames,
  imageGenerationSizes,
  imageSrcsetWidths,
  maxMessageNameStringLength,
  maxTitleStringLength,
  messageRoles,
  ridLength,
} from './constants'

export type GenerationParameters = z.infer<typeof generationParameters>
export type CompletionParameters = z.infer<typeof completionParameters>

const timeToDelete = ms('1 day')

export const ridField = z.string().length(ridLength)

export type InferenceSchema = z.infer<typeof inferenceSchema>

export type JobTypes = (typeof jobTypes)[number]

export const jobTypes = [
  'chat-completion',
  'title-completion',
  'text-to-image',
  'text-to-speech',
  'fetch-image',
] as const

export const resultTypes = ['message', 'url', 'error', 'openai-chat-completion-json'] as const

export const jobResultSchema = z.object({ type: z.enum(resultTypes), value: z.string() })

export const jobFields = {
  type: z.enum(jobTypes),
  status: z.enum(['queued', 'active', 'complete', 'failed']),
  results: jobResultSchema.array(),

  messageId: zid('messages'),
  threadId: zid('threads'),

  metrics: z
    .object({
      active: z.object({
        startedTime: z.number(),
        endedTime: z.number(),
      }),
    })
    .optional(),
}

const jobs = defineEnt(zodToConvexFields(jobFields)).deletion('soft').edge('message').edge('thread')

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

//* Generations
export const generationParameters = z.object({
  provider: z.enum(generationProviders),
  endpoint: z.string(),

  prompt: z.string(),
  size: z.enum([...imageGenerationSizes, 'custom']),
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

export const generationResultField = z.object({
  type: z.enum(['url', 'error']),
  items: z.string().array(),
})

export const generationJobFields = {
  status: z.enum(['queue', 'pending', 'active', 'complete', 'failed']),
  result: generationResultField.optional(),
  parameters: generationParameters,
}
const generation_jobs = defineEnt(zodToConvexFields(generationJobFields)).edge('message')

//* Generated Images
export const generatedImageFields = {
  ...sharedImageFields,
  srcset: srcsetField.optional(),
  parameters: generationParameters.optional(),
}
const generated_images = defineEnt(zodToConvexFields(generatedImageFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edge('message')
  .edges('generation_votes', { ref: true })

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
  .edge('generated_image')
  .index('userId', ['userId'])
  .index('ip', ['ip'])
  .index('constituent_vote', ['constituent', 'generated_imageId'])

//* Chat/Completion
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

export const completionJobResultFields = z.object({
  type: z.enum(['chatCompletion', 'error']),
  items: z.string().array(),
})

export const completionJobFields = {
  status: z.enum(['queue', 'pending', 'active', 'complete', 'failed']),
  result: completionJobResultFields.optional(),
  parameters: completionParameters,
}
const completion_jobs = defineEnt(zodToConvexFields(completionJobFields)).edge('message')

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
//* Messages
export const messageFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  text: z.string().optional(),
  content: z.string().optional(),

  inference: inferenceSchema.optional(),

  metadata: z.string().array().array().optional(),
  speechId: zid('speech').optional(),
}
export const messageFieldsObject = z.object(messageFields)
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('rid', zodToConvex(ridField), { unique: true })
  .field('private', zodToConvex(z.boolean()), { index: true })
  .edges('generated_images', { ref: true, deletion: 'soft' })
  .edges('generation_jobs', { ref: true })
  .edges('completion_jobs', { ref: true })
  .edges('jobs', { ref: true, deletion: 'soft' })
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
  .edges('jobs', { ref: true, deletion: 'soft' })
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
    completion_jobs,

    generated_images,
    generation_jobs,
    generation_votes,

    jobs,

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
