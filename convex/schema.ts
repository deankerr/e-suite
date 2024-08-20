import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { deprecated, literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { ms } from 'itty-time'

const timeToDelete = ms('1 day')

// * run config schemas
export const runConfigChatV = v.object({
  type: v.literal('chat'),
  resourceKey: v.string(),
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

export const runConfigTextToImageV = v.object({
  type: v.literal('textToImage'),
  resourceKey: v.string(),

  prompt: v.optional(v.string()),
  n: v.optional(v.number()),
  size: v.optional(v.union(v.literal('portrait'), v.literal('square'), v.literal('landscape'))),
  width: v.optional(v.number()),
  height: v.optional(v.number()),

  loras: v.optional(
    v.array(
      v.object({
        path: v.string(),
        scale: v.optional(v.number()),
      }),
    ),
  ),
})

export const runConfigTextToAudioV = v.object({
  type: v.literal('textToAudio'),
  resourceKey: v.string(),
  prompt: v.optional(v.string()),
  duration: v.optional(v.number()),
})

export const runConfigV = v.union(runConfigChatV, runConfigTextToImageV, runConfigTextToAudioV)

export const kvListV = v.array(v.object({ k: v.string(), v: v.string() }))

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
  modelId: v.string(),
  endpointModelId: v.string(),

  pricing: v.union(
    v.object({
      type: v.literal('llm'),
      tokenInput: v.number(),
      tokenOutput: v.number(),
      imageInput: v.optional(v.number()),
      imageOutput: v.optional(v.number()),
    }),
    v.object({
      type: v.literal('free'),
    }),
    v.object({
      type: v.literal('perRequest'),
      value: v.number(),
    }),
    v.object({
      type: v.literal('perSecond'),
      value: v.number(),
    }),
    v.object({
      type: v.literal('perMegapixel'),
      value: v.number(),
    }),
  ),

  moderated: v.boolean(),
  available: v.boolean(),
  hidden: v.boolean(),
  internalScore: v.number(),
}

export const chatModelFields = {
  ...sharedModelFields,
  numParameters: v.optional(v.number()),
  contextLength: v.number(),
  tokenizer: v.string(),
  stop: v.optional(v.array(v.string())),
  maxOutputTokens: v.optional(v.number()),
  type: v.optional(v.literal('chat')),
}
const chat_models = defineEnt(chatModelFields).field('resourceKey', v.string(), {
  unique: true,
})

export const imageModelFields = {
  ...sharedModelFields,
  architecture: v.string(),
  sizes: v.object({
    portrait: v.array(v.number()),
    landscape: v.array(v.number()),
    square: v.array(v.number()),
  }),
  civitaiModelId: v.optional(v.string()),
  type: v.optional(v.literal('image')),
}
const image_models = defineEnt(imageModelFields).field('resourceKey', v.string(), {
  unique: true,
})

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

  captionModelId: v.optional(v.string()),
  captionTitle: v.optional(v.string()),
  captionDescription: v.optional(v.string()),
  captionOCR: v.optional(v.string()),

  objects: v.optional(
    v.array(
      v.object({
        label: v.string(),
        score: v.number(),
        box: v.object({
          xmin: v.number(),
          ymin: v.number(),
          xmax: v.number(),
          ymax: v.number(),
        }),
      }),
    ),
  ),
  objectsModelId: v.optional(v.string()),

  generationData: v.optional(
    v.object({
      prompt: v.string(),
      modelId: v.string(),
      modelName: v.string(),
      endpointId: v.string(),
    }),
  ),

  searchText: v.string(),
}
const images = defineEnt(imageFields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .field('uid', v.string(), { unique: true })
  .edge('message')
  .edge('thread')
  .edge('user')
  .index('sourceUrl', ['sourceUrl'])
  .searchIndex('searchText', {
    searchField: 'searchText',
    filterFields: ['threadId', 'userId'],
  })

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

// * Messages
export const messageFields = {
  contentType: literals('text', 'image', 'audio'),
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),

  text: v.optional(v.string()),

  inference: deprecated,

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
  .index('threadId_contentType', ['threadId', 'contentType'])

// * Threads
export const threadFields = {
  title: v.optional(v.string()),
  instructions: v.optional(v.string()),
  latestRunConfig: v.optional(v.union(runConfigChatV, runConfigTextToImageV)),

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
  favorite: v.optional(v.boolean()),
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
  runConfigs: v.optional(
    v.array(
      v.object({
        name: v.string(),
        runConfig: v.array(runConfigV),
        keyword: v.optional(v.string()),
      }),
    ),
  ),
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

export const operationsEventLogFields = {
  type: literals('debug', 'info', 'notice', 'warning', 'error'),
  message: v.string(),
  data: v.optional(v.any()),
}
const operationsEventLog = defineEnt(operationsEventLogFields).field('ack', v.boolean(), {
  index: true,
})

export const job3Fields = {
  pipeline: v.string(),
  status: literals('pending', 'active', 'completed', 'failed'),
  currentStep: v.number(),

  input: v.any(), // * runtime check
  output: v.optional(v.any()), // NOTE currently unused

  stepResults: v.array(
    v.object({
      stepName: v.string(),
      status: literals('completed', 'failed'),
      result: v.any(),
      error: v.optional(
        v.object({
          code: v.string(),
          message: v.string(),
          fatal: v.boolean(),
          details: v.optional(v.any()),
        }),
      ),
      startTime: v.number(),
      endTime: v.number(),
      retryCount: v.number(),
    }),
  ),
  updatedAt: v.number(),

  messageId: v.optional(v.id('messages')),
  threadId: v.optional(v.id('threads')),
  imageId: v.optional(v.id('images')),
}
const jobs3 = defineEnt(job3Fields)
  .index('status', ['status'])
  .index('threadId', ['threadId'])
  .index('messageId', ['messageId'])
  .index('imageId', ['imageId'])

// * Schema
const schema = defineEntSchema(
  {
    audio,
    chat_models,
    images,
    image_models,

    messages,
    speech,
    threads,
    users,
    users_api_keys,

    jobs3,
    operationsEventLog,
  },
  {
    schemaValidation: true,
  },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
