import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { brandedString, deprecated, literals, partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { ms } from 'itty-time'
import { z } from 'zod'

import {
  fileAttachmentRecordSchema,
  inferenceSchema,
  messageRolesEnum,
  metadataKVSchema,
} from './shared/structures'
import { zMessageName, zMessageTextContent, zThreadTitle } from './shared/utils'

const timeToDelete = ms('1 day')

// * Inference Config Shared Schema
const inferenceSchemaV = v.union(
  v.object({
    endpoint: v.string(),
    endpointModelId: v.string(),
    excludeHistoryMessagesByName: v.optional(v.array(v.string())),
    maxHistoryMessages: v.optional(v.float64()),
    max_tokens: v.optional(v.float64()),
    repetition_penalty: v.optional(v.float64()),
    resourceKey: v.string(),
    stop: v.optional(v.array(v.string())),
    stream: v.optional(v.boolean()),
    temperature: v.optional(v.float64()),
    top_k: v.optional(v.float64()),
    top_p: v.optional(v.float64()),
    type: v.literal('chat-completion'),
  }),
  v.object({
    endpoint: v.string(),
    endpointModelId: v.string(),
    height: v.float64(),
    n: v.float64(),
    prompt: v.string(),
    resourceKey: v.string(),
    type: v.literal('text-to-image'),
    width: v.float64(),
  }),
  v.object({
    duration_seconds: v.optional(v.float64()),
    endpoint: v.string(),
    endpointModelId: v.string(),
    n: v.optional(v.float64()),
    prompt: v.string(),
    prompt_influence: v.optional(v.float64()),
    resourceKey: v.string(),
    type: v.literal('sound-generation'),
  }),
)

// * File Attachment Schema
const fileAttachmentRecordSchemaV = v.array(
  v.union(
    v.object({
      id: v.id('images'),
      type: v.literal('image'),
    }),
    v.object({
      type: v.literal('image_url'),
      url: v.string(),
    }),
    v.object({
      id: v.id('sound_effect_files'),
      type: v.literal('sound_effect'),
    }),
  ),
)

// * Models
const sharedModelFields = {
  name: v.string(),
  description: v.string(),
  creatorName: v.string(),
  link: v.string(),

  license: v.string(),
  tags: v.array(v.string()),
  coverImageUrl: v.optional(v.string()),

  endpoint: v.string(),
  endpointModelId: v.string(),
  pricing: v.object({}),

  moderated: v.boolean(),
  available: v.boolean(),
  hidden: v.boolean(),
  internalScore: v.number(),
}

export const chatModelFields = {
  ...sharedModelFields,
  numParameters: v.number(),
  contextLength: v.number(),
  tokenizer: v.string(),
  stop: v.array(v.string()),
  maxOutputTokens: v.optional(v.number()),
}
const chat_models = defineEnt(chatModelFields).field('resourceKey', v.string(), {
  unique: true,
})

export const imageModelFields = {
  ...sharedModelFields,
  architecture: literals('SD', 'SDXL', 'SD3'),
  sizes: v.object({
    portrait: v.array(v.number()),
    landscape: v.array(v.number()),
    square: v.array(v.number()),
  }),
  civitaiModelId: v.optional(v.string()),
}
const image_models = defineEnt(imageModelFields).field('resourceKey', v.string(), {
  unique: true,
})

export const fileFields = {
  fileId: v.id('_storage'),
  isOriginFile: v.boolean(),

  category: v.literal('image'),
  format: v.string(),

  width: v.optional(v.number()),
  height: v.optional(v.number()),
}
const files = defineEnt(fileFields).edge('image')

export const imageFields = {
  originUrl: v.string(),

  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  generationData: v.array(v.string()),
  messageId: v.id('messages'), // ? added by accident?
}
const images = defineEnt(imageFields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edges('files', { ref: true })
  .index('originUrl', ['originUrl'])

export const jobAttributeFields = {
  threadId: v.optional(v.id('threads')),
  messageId: v.optional(v.id('messages')),
  imageId: v.optional(v.id('images')),

  url: v.optional(v.string()),
  width: v.optional(v.number()),
  resourceKey: v.optional(v.string()),
}
export const jobFields = {
  name: v.string(),
  status: literals('queued', 'active', 'complete', 'failed'),
  errors: v.optional(
    v.array(
      v.object({
        code: v.string(),
        message: v.string(),
        fatal: v.boolean(),
      }),
    ),
  ),
  queuedTime: v.number(),
  startedTime: v.optional(v.number()),
  endedTime: v.optional(v.number()),

  ...jobAttributeFields,
}
const jobs = defineEnt(jobFields)
  .index('status', ['status'])
  .index('threadId', ['threadId'])
  .index('messageId', ['messageId'])
  .index('imageId', ['imageId'])

export const messageFields = {
  role: v.union(v.literal('system'), v.literal('assistant'), v.literal('user')),
  name: v.optional(v.string()),
  content: v.optional(v.string()),

  inference: v.optional(inferenceSchemaV),
  files: v.optional(fileAttachmentRecordSchemaV),

  metadata: v.optional(v.array(v.object({ key: v.string(), value: v.string() }))),
  voiceover: v.optional(
    v.object({
      resourceKey: v.string(),
      speechFileId: v.optional(v.id('speech_files')),
      text: v.optional(v.string()),
      textHash: v.string(),
    }),
  ),
}
const messages = defineEnt(messageFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', v.number(), { index: true })
  .edge('thread')
  .edge('user')
  .index('threadId_series', ['threadId', 'series'])
  .index('speechId', ['voiceover.speechFileId'])
  .index('threadId_role', ['threadId', 'role'])

export const soundEffectFileFields = {
  text: v.string(),
  fileId: v.id('_storage'),
  fileUrl: v.string(),
}
const sound_effect_files = defineEnt(soundEffectFileFields)

export const speechFileFields = {
  textHash: v.string(),
  resourceKey: v.string(),
  status: literals('pending', 'complete', 'error'),
  fileId: v.optional(v.id('_storage')),
  fileUrl: v.optional(v.string()),
  error: v.optional(v.string()),
  updatedAtTime: v.number(),
}
const speech_files = defineEnt(speechFileFields).index('textHash_resourceKey', [
  'textHash',
  'resourceKey',
])

export const threadFields = {
  title: zThreadTitle.optional(),
  instructions: zMessageTextContent.optional(),
  inference: inferenceSchema,
  slashCommands: z
    .object({
      id: z.string(),
      command: z.string(),
      commandType: z.enum(['startsWith', 'includesWord']),
      inference: inferenceSchema,
    })
    .array(),
  voiceovers: z
    .object({
      default: z.string(),
      names: z
        .object({
          name: z.string(),
          resourceKey: z.string(),
        })
        .array()
        .optional(),
    })
    .optional(),

  updatedAtTime: z.number(),
  metadata: metadataKVSchema.array().optional(),
}
const threads = defineEnt(zodToConvexFields(threadFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('slug', zodToConvex(z.string()), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edge('user')

export const userFields = {
  name: v.string(),
  imageUrl: v.string(),
  role: literals('user', 'admin'),
}
const users = defineEnt(userFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('tokenIdentifier', v.string(), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true, deletion: 'soft' })
  .edges('messages', { ref: true })

export const usersApiKeysFields = {
  valid: v.boolean(),
}
const users_api_keys = defineEnt(usersApiKeysFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', v.string(), { unique: true })
  .edge('user')

export const endpointDataCacheFields = {
  endpoint: v.string(),
  name: v.string(),
  data: v.string(),
}
const endpoint_data_cache = defineEnt(endpointDataCacheFields)

const schema = defineEntSchema(
  {
    chat_models,
    endpoint_data_cache,
    files,
    jobs,
    images,
    image_models,

    messages,
    sound_effect_files,
    speech_files,
    threads,
    users,
    users_api_keys,
  },
  {
    schemaValidation: true,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)

// Votes
// export const generationVoteFields = {
//   vote: z.enum(generationVoteNames),

//   userId: zid('users').optional(),
//   ip: z.string().optional(),
//   constituent: z.string().uuid(),
//   metadata: z.any().optional(),
// }
