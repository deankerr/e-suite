import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
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

//* Models
const sharedModelFields = {
  name: z.string(),
  description: z.string(),
  creatorName: z.string(),
  link: z.string(),

  license: z.string(),
  tags: z.string().array(),
  coverImageUrl: z.string().optional(),

  endpoint: z.string(),
  endpointModelId: z.string(),
  pricing: z.object({
    tokenInput: z.number().optional(),
    tokenOutput: z.number().optional(),
    imageInput: z.number().optional(),
    imageOutput: z.number().optional(),
    // {unit, price, in/out}[]
  }),

  moderated: z.boolean(),
  available: z.boolean(),
  hidden: z.boolean(),
  internalScore: z.number(),
}

export const chatModelFields = {
  ...sharedModelFields,
  numParameters: z.number(),
  contextLength: z.number(),
  tokenizer: z.string(),
  stop: z.string().array(),
  maxOutputTokens: z.number().optional(),
}
const chat_models = defineEnt(zodToConvexFields(chatModelFields)).field(
  'resourceKey',
  zodToConvex(z.string()),
  { unique: true },
)

export const imageModelFields = {
  ...sharedModelFields,
  architecture: z.enum(['SD', 'SDXL', 'SD3']),
  sizes: z.object({
    portrait: z.tuple([z.number(), z.number()]),
    landscape: z.tuple([z.number(), z.number()]),
    square: z.tuple([z.number(), z.number()]),
  }),
  civitaiModelId: z.string().optional(),
}
const image_models = defineEnt(zodToConvexFields(imageModelFields)).field(
  'resourceKey',
  zodToConvex(z.string()),
  { unique: true },
)

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

export const jobAttributeFields = {
  threadId: zid('threads').optional(),
  messageId: zid('messages').optional(),
  imageId: zid('images').optional(),

  url: z.string().optional(),
  width: z.number().optional(),
  resourceKey: z.string().optional(),
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

export const messageFields = {
  role: messageRolesEnum,
  name: zMessageName.optional(),
  content: zMessageTextContent.optional(),

  inference: inferenceSchema.optional(),
  files: fileAttachmentRecordSchema.array().optional(),

  metadata: metadataKVSchema.array().optional(),
  voiceover: z
    .object({
      text: z.string().optional(),
      textHash: z.string(),
      resourceKey: z.string(),
      speechFileId: zid('speech_files').optional(),
    })
    .optional(),
}
const messages = defineEnt(zodToConvexFields(messageFields))
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', zodToConvex(z.number()), { index: true })
  .edge('thread')
  .edge('user')
  .index('threadId_series', ['threadId', 'series'])
  .index('speechId', ['voiceover.speechFileId'])

export const speechFileFields = {
  textHash: z.string(),
  resourceKey: z.string(),
  status: z.enum(['pending', 'complete', 'error']),
  fileId: zid('_storage').optional(),
  fileUrl: z.string().optional(),
  error: z.string().optional(),
  updatedAtTime: z.number(),
}
const speech_files = defineEnt(zodToConvexFields(speechFileFields)).index('textHash_resourceKey', [
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

  // TODO remove after prod migration
  config: z
    .object({
      ui: inferenceSchema,
      saved: z
        .object({
          inference: inferenceSchema,
          name: zMessageName,
          command: zMessageName.optional(),
        })
        .array(),
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
const endpoint_data_cache = defineEnt(zodToConvexFields(endpointDataCacheFields))

const schema = defineEntSchema(
  {
    chat_models,
    endpoint_data_cache,
    files,
    jobs,
    images,
    image_models,

    messages,
    speech_files,
    threads,
    users,
    users_api_keys,
  },
  {
    schemaValidation: false,
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
