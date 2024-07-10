import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { ms } from 'itty-time'

const timeToDelete = ms('1 day')

// * shared schemas
export const chatCompletionConfigV = v.object({
  type: v.literal('chat-completion'),
  resourceKey: v.string(),
  endpoint: v.string(),
  endpointModelId: v.string(),
  excludeHistoryMessagesByName: v.optional(v.array(v.string())),
  maxHistoryMessages: v.optional(v.number()),

  stream: v.optional(v.boolean()),
  temperature: v.optional(v.number()),
  max_tokens: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  repetition_penalty: v.optional(v.number()),
  frequency_penalty: v.optional(v.number()),
  presence_penalty: v.optional(v.number()),
})

export const textToImageConfigV = v.object({
  type: v.literal('text-to-image'),
  resourceKey: v.string(),
  endpoint: v.string(),
  endpointModelId: v.string(),

  prompt: v.string(),
  n: v.number(),
  width: v.number(),
  height: v.number(),
  size: v.optional(v.union(v.literal('portrait'), v.literal('square'), v.literal('landscape'))),
})

export const soundGenerationConfigV = v.object({
  type: v.literal('sound-generation'),
  resourceKey: v.string(),
  endpoint: v.string(),
  endpointModelId: v.string(),

  prompt: v.string(),
  duration_seconds: v.optional(v.number()),
  prompt_influence: v.optional(v.number()),
  n: v.optional(v.number()),
})

export const inferenceConfigV = v.union(
  chatCompletionConfigV,
  textToImageConfigV,
  soundGenerationConfigV,
)

export const fileAttachmentRecordSchemaV = v.array(
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

export const kvListV = v.array(v.object({ k: v.string(), v: v.string() }))

export const jobErrorV = v.object({
  code: v.string(),
  message: v.string(),
  fatal: v.boolean(),
  status: v.optional(v.number()),
})

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

// * Jobs
export const jobAttributeFields = {
  threadId: v.optional(v.id('threads')),
  messageId: v.optional(v.id('messages')),
  imageId: v.optional(v.id('images')),
  speechId: v.optional(v.id('speech')),

  url: v.optional(v.string()),
  text: v.optional(v.string()),
  resourceKey: v.optional(v.string()),
}
export const jobFields = {
  name: v.string(),
  status: literals('queued', 'active', 'complete', 'failed'),
  errors: v.optional(v.array(jobErrorV)),
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

// * images
export const imageFields = {
  sourceType: v.optional(v.union(v.literal('textToImage'), v.literal('user'))),
  sourceUrl: v.string(),

  fileId: v.id('_storage'),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  nsfwProbability: v.optional(v.number()),
  captionText: v.optional(v.string()), // main caption, searchable
  captionModelId: v.optional(v.string()),
  // alternate/regenerated captions
  captions: v.optional(
    v.array(
      v.object({
        text: v.optional(v.string()),
        modelId: v.string(),
      }),
    ),
  ),

  // inference parameter data - not present on eg. message images uploaded/linked by user
  generationData: v.optional(
    v.object({
      prompt: v.string(),
      modelId: v.string(),
      modelName: v.string(),
      endpointId: v.string(),
    }),
  ),
}
const images = defineEnt(imageFields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edge('message')
  .edge('thread')
  .edge('user')
  .index('sourceUrl', ['sourceUrl'])
  .index('threadId_sourceType', ['threadId', 'sourceType'])

// * audio
export const audioFields = {
  fileId: v.id('_storage'),

  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
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

// * Messages
export const messageFields = {
  contentType: literals('text', 'image', 'audio'),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),

  text: v.optional(v.string()),
  references: v.optional(
    v.array(
      v.object({
        url: v.string(),
        contentType: literals('image', 'unknown'),
        imageId: v.optional(v.id('images')),
      }),
    ),
  ),

  inference: v.optional(inferenceConfigV),

  hasImageReference: v.boolean(),
  hasImageContent: v.optional(v.boolean()),
  metadata: v.optional(kvListV),
}
const messages = defineEnt(messageFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('series', v.number(), { index: true })
  .edge('thread')
  .edge('user')
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('images', { ref: true, deletion: 'soft' })
  .index('threadId_series', ['threadId', 'series'])
  .index('threadId_role', ['threadId', 'role'])
  .index('threadId_role_hasImageContent', ['threadId', 'role', 'hasImageContent'])
  .index('threadId_hasImageContent', ['threadId', 'hasImageContent'])
  .index('threadId_contentType', ['threadId', 'contentType'])

// * Threads
export const threadFields = {
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  inference: inferenceConfigV,
  slashCommands: v.array(
    v.object({
      id: v.string(),
      command: v.string(),
      commandType: literals('startsWith', 'includesWord'),
      inference: inferenceConfigV,
    }),
  ),

  voiceovers: v.optional(
    v.object({
      default: v.string(),
      names: v.optional(
        v.array(
          v.object({
            name: v.string(),
            resourceKey: v.string(),
          }),
        ),
      ),
    }),
  ),

  updatedAtTime: v.number(),
  metadata: v.optional(kvListV),
}
const threads = defineEnt(threadFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('slug', v.string(), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edge('user')
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('images', { ref: true, deletion: 'soft' })

// * Users
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
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('images', { ref: true, deletion: 'soft' })

export const usersApiKeysFields = {
  valid: v.boolean(),
}
const users_api_keys = defineEnt(usersApiKeysFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', v.string(), { unique: true })
  .edge('user')

// * Endpoint Data
export const endpointDataCacheFields = {
  endpoint: v.string(),
  name: v.string(),
  data: v.string(),
}
const endpoint_data_cache = defineEnt(endpointDataCacheFields)

// * Schema
const schema = defineEntSchema(
  {
    audio,
    chat_models,
    endpoint_data_cache,
    jobs,
    images,
    image_models,

    messages,
    speech,
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
