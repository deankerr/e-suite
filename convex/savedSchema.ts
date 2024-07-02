import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  chat_models: defineTable({
    available: v.boolean(),
    contextLength: v.float64(),
    coverImageUrl: v.optional(v.string()),
    creatorName: v.string(),
    description: v.string(),
    endpoint: v.string(),
    endpointModelId: v.string(),
    hidden: v.boolean(),
    internalScore: v.float64(),
    license: v.string(),
    link: v.string(),
    maxOutputTokens: v.optional(v.float64()),
    moderated: v.boolean(),
    name: v.string(),
    numParameters: v.float64(),
    pricing: v.object({}),
    resourceKey: v.string(),
    stop: v.array(v.string()),
    tags: v.array(v.string()),
    tokenizer: v.string(),
  }).index('resourceKey', ['resourceKey']),

  endpoint_data_cache: defineTable({
    data: v.string(),
    endpoint: v.string(),
    name: v.string(),
  }),

  files: defineTable({
    category: v.literal('image'),
    fileId: v.id('_storage'),
    format: v.string(),
    height: v.optional(v.float64()),
    imageId: v.id('images'),
    isOriginFile: v.boolean(),
    width: v.optional(v.float64()),
  }).index('imageId', ['imageId']),

  image_models: defineTable({
    architecture: v.union(v.literal('SD'), v.literal('SDXL'), v.literal('SD3')),
    available: v.boolean(),
    civitaiModelId: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    creatorName: v.string(),
    description: v.string(),
    endpoint: v.string(),
    endpointModelId: v.string(),
    hidden: v.boolean(),
    internalScore: v.float64(),
    license: v.string(),
    link: v.string(),
    moderated: v.boolean(),
    name: v.string(),
    pricing: v.object({}),
    resourceKey: v.string(),
    sizes: v.object({
      landscape: v.array(v.union(v.float64(), v.float64())),
      portrait: v.array(v.union(v.float64(), v.float64())),
      square: v.array(v.union(v.float64(), v.float64())),
    }),
    tags: v.array(v.string()),
  }).index('resourceKey', ['resourceKey']),

  images: defineTable({
    blurDataUrl: v.string(),
    color: v.string(),
    deletionTime: v.optional(v.float64()),
    generationData: v.array(v.array(v.union(v.string(), v.string()))),
    height: v.float64(),
    messageId: v.id('messages'),
    originUrl: v.string(),
    width: v.float64(),
  }).index('originUrl', ['originUrl']),

  jobs: defineTable({
    endedTime: v.optional(v.float64()),
    errors: v.optional(
      v.array(
        v.object({
          code: v.string(),
          fatal: v.boolean(),
          message: v.string(),
        }),
      ),
    ),
    imageId: v.optional(v.id('images')),
    messageId: v.optional(v.id('messages')),
    name: v.string(),
    queuedTime: v.float64(),
    resourceKey: v.optional(v.string()),
    startedTime: v.optional(v.float64()),
    status: v.union(
      v.literal('queued'),
      v.literal('active'),
      v.literal('complete'),
      v.literal('failed'),
    ),
    threadId: v.optional(v.id('threads')),
    url: v.optional(v.string()),
    width: v.optional(v.float64()),
  })
    .index('imageId', ['imageId'])
    .index('messageId', ['messageId'])
    .index('status', ['status'])
    .index('threadId', ['threadId']),

  messages: defineTable({
    content: v.optional(v.string()),
    deletionTime: v.optional(v.float64()),
    files: v.optional(
      v.array(
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
      ),
    ),
    inference: v.optional(
      v.union(
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
      ),
    ),
    metadata: v.optional(v.array(v.object({ key: v.string(), value: v.string() }))),
    name: v.optional(v.string()),
    role: v.union(v.literal('system'), v.literal('assistant'), v.literal('user')),
    series: v.float64(),
    threadId: v.id('threads'),
    userId: v.id('users'),
    voiceover: v.optional(
      v.object({
        resourceKey: v.string(),
        speechFileId: v.optional(v.id('speech_files')),
        text: v.optional(v.string()),
        textHash: v.string(),
      }),
    ),
  })
    .index('series', ['series'])
    .index('speechId', ['voiceover.speechFileId'])
    .index('threadId', ['threadId'])
    .index('threadId_role', ['threadId', 'role'])
    .index('threadId_series', ['threadId', 'series'])
    .index('userId', ['userId']),

  sound_effect_files: defineTable({
    fileId: v.id('_storage'),
    fileUrl: v.string(),
    text: v.string(),
  }),

  speech_files: defineTable({
    error: v.optional(v.string()),
    fileId: v.optional(v.id('_storage')),
    fileUrl: v.optional(v.string()),
    resourceKey: v.string(),
    status: v.union(v.literal('pending'), v.literal('complete'), v.literal('error')),
    textHash: v.string(),
    updatedAtTime: v.float64(),
  }).index('textHash_resourceKey', ['textHash', 'resourceKey']),

  threads: defineTable({
    deletionTime: v.optional(v.float64()),
    inference: v.union(
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
    ),
    instructions: v.optional(v.string()),
    metadata: v.optional(v.array(v.object({ key: v.string(), value: v.string() }))),
    slashCommands: v.array(
      v.object({
        command: v.string(),
        commandType: v.union(v.literal('startsWith'), v.literal('includesWord')),
        id: v.string(),
        inference: v.union(
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
        ),
      }),
    ),
    slug: v.string(),
    title: v.optional(v.string()),
    updatedAtTime: v.float64(),
    userId: v.id('users'),
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
  })
    .index('slug', ['slug'])
    .index('userId', ['userId']),

  users: defineTable({
    deletionTime: v.optional(v.float64()),
    imageUrl: v.string(),
    name: v.string(),
    role: v.union(v.literal('user'), v.literal('admin')),
    tokenIdentifier: v.string(),
  }).index('tokenIdentifier', ['tokenIdentifier']),

  users_api_keys: defineTable({
    deletionTime: v.optional(v.float64()),
    secret: v.string(),
    userId: v.id('users'),
    valid: v.boolean(),
  })
    .index('secret', ['secret'])
    .index('userId', ['userId']),
})
