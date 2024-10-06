import { defineEnt, defineEntFromTable, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { migrationsTable } from 'convex-helpers/server/migrations'
import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { ms } from 'itty-time'

const timeToDelete = ms('1 day')

// * Models
export const chatModelFields = {
  name: v.string(),
  description: v.string(),
  creatorName: v.string(),
  created: v.number(),
  link: v.string(),

  license: v.string(),
  tags: v.array(v.string()),
  coverImageUrl: v.optional(v.string()),

  provider: v.string(),
  modelId: v.string(),

  pricing: v.object({
    tokenInput: v.number(),
    tokenOutput: v.number(),
    imageInput: v.optional(v.number()),
    imageOutput: v.optional(v.number()),
  }),

  moderated: v.boolean(),
  available: v.boolean(),
  hidden: v.boolean(),
  internalScore: v.number(),

  numParameters: v.optional(v.number()),
  contextLength: v.number(),
  tokenizer: v.string(),
  stop: v.optional(v.array(v.string())),
  maxOutputTokens: v.optional(v.number()),
}
const chat_models = defineEnt(chatModelFields).field('resourceKey', v.string(), {
  unique: true,
})

export const collectionFields = {
  title: v.string(),
}
export const collections = defineEnt(collectionFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('id', v.string(), { unique: true })
  .edge('user', { field: 'ownerId' })
  .edges('images_v2')

// * images
export const imagesV2Fields = {
  sourceUrl: v.string(),
  sourceType: v.string(),
  fileId: v.id('_storage'),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  generationId: v.optional(v.id('generations_v2')),
  runId: v.string(),
  createdAt: v.optional(v.number()),
  ownerId: v.id('users'),
}
const images_v2 = defineEnt(imagesV2Fields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('id', v.string(), { unique: true })
  .index('generationId', ['generationId'])
  .index('ownerId', ['ownerId'])
  .index('ownerId_sourceUrl', ['ownerId', 'sourceUrl'])
  .index('runId', ['runId'])
  .index('fileId', ['fileId'])
  .edges('images_metadata_v2', { to: 'images_metadata_v2', ref: 'imageId', deletion: 'soft' })
  .edges('collections')

export const imagesMetadataV2Fields = {
  data: v.union(
    v.object({
      type: v.literal('caption'),
      version: v.number(),
      modelId: v.string(),
      title: v.string(),
      description: v.string(),
      ocr: v.array(v.string()),
    }),

    v.object({
      type: v.literal('generation'),
      version: v.number(),
      prompt: v.string(),
      modelId: v.string(),
      modelName: v.string(),
      provider: v.string(),
    }),

    v.object({
      type: v.literal('nsfwProbability'),
      nsfwProbability: v.number(),
    }),

    v.object({
      type: v.literal('message'),
      role: v.string(),
      name: v.optional(v.string()),
      text: v.string(),
    }),
  ),
}
const images_metadata_v2 = defineEnt(imagesMetadataV2Fields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edge('image', {
    to: 'images_v2',
    field: 'imageId',
  })

export const generationV2Fields = {
  status: literals('queued', 'active', 'done', 'failed'),
  updatedAt: v.number(),
  workflow: v.optional(v.string()),
  input: v.any(),
  output: v.optional(v.any()),
  results: v.optional(
    v.array(
      v.object({
        contentType: v.string(),
        url: v.string(),
        width: v.number(),
        height: v.number(),
      }),
    ),
  ),
  errors: v.optional(v.array(v.any())),
  runId: v.string(),
  ownerId: v.id('users'),
}
const generations_v2 = defineEnt(generationV2Fields)
  .index('status', ['status'])
  .index('runId', ['runId'])
  .index('ownerId', ['ownerId'])

// * audio
export const audioFields = {
  fileId: v.id('_storage'),

  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
}
const audio = defineEnt(audioFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('message')
  .edge('thread')
  .edge('user')
  .searchIndex('prompt', {
    searchField: 'generationData.prompt',
    filterFields: ['threadId', 'userId', 'generationData.modelId'],
  })

// * speech
export const speechFields = {
  fileId: v.optional(v.id('_storage')),
  resourceKey: v.string(),
  textHash: v.string(),
}
const speech = defineEnt(speechFields).index('textHash_resourceKey', ['textHash', 'resourceKey'])

// * Texts
export const textFields = {
  type: literals('prompt', 'message'),
  title: v.optional(v.string()),
  content: v.string(),
  updatedAt: v.number(),
  runId: v.optional(v.id('runs')),
}
const texts = defineEnt(textFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('user')
  .index('userId_type', ['userId', 'type'])
  .index('runId', ['runId'])

// * Messages
export const messageFields = {
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  text: v.optional(v.string()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  runId: v.optional(v.id('runs')),
}
const messages = defineEnt(messageFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', v.number(), { index: true })
  .edge('thread')
  .edge('user')
  .edges('audio', { ref: true, deletion: 'soft' })
  .index('threadId_series', ['threadId', 'series'])
  .index('threadId_role', ['threadId', 'role'])
  .index('threadId_name', ['threadId', 'name'])
  .index('threadId_role_name', ['threadId', 'role', 'name'])
  .index('runId', ['runId'])
  .searchIndex('search_text_threadId_role_name', {
    searchField: 'text',
    filterFields: ['threadId', 'role', 'name'],
  })

// * Threads
export const threadFields = {
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  latestRunConfig: v.optional(v.any()),
  favourite: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  updatedAtTime: v.number(),
}
const threads = defineEnt(threadFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('slug', v.string(), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edge('user')

export const modelParametersFields = {
  maxTokens: v.optional(v.number()),
  temperature: v.optional(v.number()),
  topP: v.optional(v.number()),
  topK: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  repetitionPenalty: v.optional(v.number()),
  frequencyPenalty: v.optional(v.number()),
  presencePenalty: v.optional(v.number()),
}

export const runFields = {
  status: literals('queued', 'active', 'done', 'failed'),
  updatedAt: v.number(),
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),

  model: v.object({
    id: v.string(),
    provider: v.string(),
  }),
  modelParameters: v.optional(v.object(modelParametersFields)),
  instructions: v.optional(v.string()),

  stream: v.boolean(),
  maxMessages: v.optional(v.number()),
  prependNamesToMessageContent: v.optional(v.boolean()),
  kvMetadata: v.optional(v.record(v.string(), v.string())),

  usage: v.optional(
    v.object({
      promptTokens: v.number(),
      completionTokens: v.number(),
      totalTokens: v.number(),
    }),
  ),
  finishReason: v.optional(v.string()),
  cost: v.optional(v.number()),
  providerMetadata: v.optional(v.any()),
  errors: v.optional(v.array(v.any())),

  messageId: v.optional(v.id('messages')),
}
const runs = defineEnt(runFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('thread')
  .edge('user')
  .index('messageId', ['messageId'])

// * Users
export const userFields = {
  name: v.string(),
  imageUrl: v.string(),
  role: literals('user', 'admin'),
  runConfigs: v.optional(
    v.array(
      v.object({
        name: v.string(),
        runConfig: v.array(v.any()),
        keyword: v.optional(v.string()),
      }),
    ),
  ),
}
const users = defineEnt(userFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('tokenIdentifier', v.string(), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('collections', { ref: 'ownerId', deletion: 'soft' })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('runs', { ref: true, deletion: 'soft' })
  .edges('texts', { ref: 'userId', deletion: 'soft' })
  .edges('threads', { ref: true, deletion: 'soft' })

export const usersApiKeysFields = {
  valid: v.boolean(),
}
const users_api_keys = defineEnt(usersApiKeysFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', v.string(), { unique: true })
  .edge('user')

export const operationsEventLogFields = {
  type: literals('debug', 'info', 'notice', 'warning', 'error'),
  message: v.string(),
  data: v.optional(v.any()),
}
const operationsEventLog = defineEnt(operationsEventLogFields).field('ack', v.boolean(), {
  index: true,
})

// * Schema
const schema = defineEntSchema(
  {
    audio,
    chat_models,
    collections,
    images_v2,
    images_metadata_v2,
    generations_v2,

    texts,
    messages,
    runs,
    speech,
    threads,
    users,
    users_api_keys,

    operationsEventLog,
    migrations: defineEntFromTable(migrationsTable),
  },
  {
    schemaValidation: true,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
