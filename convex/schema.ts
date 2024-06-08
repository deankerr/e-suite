import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
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

const sharedModelFields = {
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  creatorName: z.string(),
  link: z.string(),

  license: z.string(),
  tags: z.string().array(),
  coverImageUrl: z.string().optional(),

  endpoints: z
    .object({
      endpoint: z.string(),
      model: z.string(),
      pricing: z.object({
        tokenInput: z.number().optional(),
        tokenOutput: z.number().optional(),
        imageInput: z.number().optional(),
        imageOutput: z.number().optional(),
      }),
      maxOutputTokens: z.number().optional(),
      isModerated: z.boolean().optional(),
      modelDataSource: z.string().optional(),
    })
    .array(),
}

export const chatModelFields = {
  ...sharedModelFields,
  numParameters: z.number(),
  contextLength: z.number(),
  tokenizer: z.string(),
  stop: z.string().array(),
  maxOutputTokens: z.number().optional(),
}
const chatModels = defineEnt(zodToConvexFields(chatModelFields))

export const jobAttributeFields = {
  threadId: zid('threads').optional(),
  messageId: zid('messages').optional(),
  imageId: zid('images').optional(),

  url: z.string().optional(),
  width: z.number().optional(),
}
export const jobFields = {
  name: z.string(),
  status: z.enum(['queued', 'active', 'complete', 'failed']),
  errors: z
    .object({
      code: z.string(),
      message: z.string(),
      fatal: z.boolean(),
    })
    .array()
    .optional(),

  queuedTime: z.number(),
  startedTime: z.number().optional(),
  endedTime: z.number().optional(),

  ...jobAttributeFields,
}

const jobs = defineEnt(zodToConvexFields(jobFields))
  .index('status', ['status'])
  .index('threadId', ['threadId'])
  .index('messageId', ['messageId'])
  .index('imageId', ['imageId'])

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

// Votes
// export const generationVoteFields = {
//   vote: z.enum(generationVoteNames),

//   userId: zid('users').optional(),
//   ip: z.string().optional(),
//   constituent: z.string().uuid(),
//   metadata: z.any().optional(),
// }

export const fileFields = {
  fileId: zid('_storage'),
  isOriginFile: z.boolean(),

  category: z.enum(['image']),
  format: z.string(),

  width: z.number().optional(),
  height: z.number().optional(),
}
const files = defineEnt(zodToConvexFields(fileFields)).edge('image')

export const imageFields = {
  originUrl: z.string(),

  width: z.number(),
  height: z.number(),
  blurDataUrl: z.string(),
  color: z.string(),

  generationData: z.tuple([z.string(), z.string()]).array(),
}

const images = defineEnt(zodToConvexFields(imageFields))
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edges('files', { ref: true })
  .index('originUrl', ['originUrl'])

export const messageFields = {
  role: messageRolesEnum,
  name: zMessageName.optional(),
  content: zMessageTextContent.optional(),

  inference: inferenceSchema.optional(),
  files: fileAttachmentRecordSchema.array().optional(),

  metadata: metadataKVSchema.array().optional(),
  speechId: zid('speech').optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', zodToConvex(z.number()), { index: true })
  .edge('thread')
  .edge('user')
  .index('threadId_series', ['threadId', 'series'])

export const threadFields = {
  title: zThreadTitle.optional(),
  instructions: zMessageTextContent.optional(),
  currentInferenceConfig: inferenceSchema.optional(),
  savedInferenceConfigs: z
    .object({
      inference: inferenceSchema,
      name: zMessageName,
      command: zMessageName.optional(),
    })
    .array()
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
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(userFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true, deletion: 'soft' })
  .edges('messages', { ref: true })

export const usersApiKeysFields = {
  valid: z.boolean(),
}
const users_api_keys = defineEnt(zodToConvexFields(usersApiKeysFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', zodToConvex(z.string()), { unique: true })
  .edge('user')

export const endpointDataCacheFields = {
  endpoint: z.string(),
  name: z.string(),
  data: z.string(),
}
const endpointDataCache = defineEnt(zodToConvexFields(endpointDataCacheFields))

const schema = defineEntSchema(
  {
    chatModels,
    endpointDataCache,
    files,
    jobs,
    images,

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
