import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { literals, partial } from 'convex-helpers/validators'
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
  width: v.number(),
  height: v.number(),
  n: v.number(),
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

  url: v.optional(v.string()),
  width: v.optional(v.number()),
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

// * Files
// # new Image fields
const newImageFields = {
  fileId: v.id('_storage'),
  sourceUrl: v.string(),
  format: v.string(),
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

  // edges
  threadId: v.id('threads'),
  userId: v.id('users'),
}

export const imageFields = {
  ...newImageFields,

  originUrl: v.optional(v.string()), // TODO remove
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  color: v.string(),

  // TODO remove
  caption: v.optional(
    v.object({
      text: v.optional(v.string()),
      modelId: v.string(),
    }),
  ),
  nsfwProbability: v.optional(v.number()),

  messageId: v.id('messages'),
}
const images = defineEnt(imageFields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .index('originUrl', ['originUrl'])
  .index('messageId', ['messageId'])
// TODO after migration: add image indexes/edges

// # new - audio - full migration
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

// # new - speech - full migration
export const speechFields = {
  fileId: v.optional(v.id('_storage')),
  resourceKey: v.string(),
  textHash: v.string(),
}
const speech = defineEnt(speechFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .edge('message')
  .edge('thread')
  .edge('user')
  .index('textHash_resourceKey', ['textHash', 'resourceKey'])

// * Messages
// # new message fields
export const newMessageFields = {
  contentType: literals('text', 'image', 'audio'),

  text: v.optional(v.string()), // main text content, searchable. may represent something like an image description rather than a "written message"
  references: v.optional(
    v.array(
      v.object({
        url: v.string(),
        contentType: literals('image', 'unknown'),
        imageId: v.optional(v.id('images')),
      }),
    ),
  ),
  hasImageReference: v.boolean(),
}

export const messageFields = {
  ...partial(newMessageFields),

  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
  content: v.optional(v.string()), // TODO migrate to text

  inference: v.optional(inferenceConfigV),
  files: v.optional(fileAttachmentRecordSchemaV), // TODO migrate generations to edges, user input images to attachments

  metadata: v.optional(kvListV),
  voiceover: v.optional(
    v.object({
      resourceKey: v.string(),
      speechFileId: v.optional(v.id('speech')),
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
  .edges('audio', { ref: true, deletion: 'soft' }) // # new
  .edges('speech', { ref: true, deletion: 'soft' }) // # new
  .index('threadId_series', ['threadId', 'series'])
  .index('speechId', ['voiceover.speechFileId'])
  .index('threadId_role', ['threadId', 'role'])
// # draft
// .index('inferenceType', ['threadId', 'role', 'inference.type'])
// .searchIndex('text', {
//   searchField: 'text'
// })

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
  .edges('audio', { ref: true, deletion: 'soft' }) // # new
  .edges('speech', { ref: true, deletion: 'soft' }) // # new

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
  .edges('messages', { ref: true, deletion: 'soft' }) // # new
  .edges('audio', { ref: true, deletion: 'soft' }) // # new
  .edges('speech', { ref: true, deletion: 'soft' }) // # new

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
