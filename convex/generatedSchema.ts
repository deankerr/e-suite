import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  chat_models: defineTable({
    available: v.boolean(),
    contextLength: v.float64(),
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
  }),

  endpoint_data_cache: defineTable({
    data: v.string(),
    endpoint: v.string(),
    name: v.string(),
  }),

  files: defineTable({
    category: v.string(),
    fileId: v.id('_storage'),
    format: v.string(),
    height: v.float64(),
    imageId: v.id('images'),
    isOriginFile: v.boolean(),
    width: v.float64(),
  }),

  image_models: defineTable({
    architecture: v.string(),
    available: v.boolean(),
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
      landscape: v.array(v.float64()),
      portrait: v.array(v.float64()),
      square: v.array(v.float64()),
    }),
    tags: v.array(v.any()),
  }),

  images: defineTable({
    blurDataUrl: v.string(),
    color: v.string(),
    generationData: v.array(v.any()),
    height: v.float64(),
    messageId: v.id('messages'),
    originUrl: v.string(),
    width: v.float64(),
  }),

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
    messageId: v.optional(v.id('messages')),
    name: v.string(),
    queuedTime: v.float64(),
    startedTime: v.float64(),
    status: v.string(),
    threadId: v.optional(v.id('threads')),
    url: v.optional(v.string()),
  }),

  messages: defineTable({
    content: v.optional(v.string()),
    files: v.optional(
      v.array(
        v.object({
          id: v.optional(v.union(v.id('images'), v.id('sound_effect_files'))),
          type: v.string(),
          url: v.optional(v.string()),
        }),
      ),
    ),
    inference: v.optional(
      v.object({
        duration_seconds: v.optional(v.float64()),
        endpoint: v.string(),
        endpointModelId: v.string(),
        excludeHistoryMessagesByName: v.optional(v.array(v.string())),
        height: v.optional(v.float64()),
        maxHistoryMessages: v.optional(v.float64()),
        n: v.optional(v.float64()),
        prompt: v.optional(v.string()),
        resourceKey: v.string(),
        stream: v.optional(v.boolean()),
        type: v.string(),
        width: v.optional(v.float64()),
      }),
    ),
    name: v.optional(v.string()),
    role: v.string(),
    series: v.float64(),
    threadId: v.id('threads'),
    userId: v.id('users'),
    voiceover: v.optional(
      v.object({
        resourceKey: v.string(),
        speechFileId: v.id('speech_files'),
        textHash: v.string(),
      }),
    ),
  }),

  sound_effect_files: defineTable({
    fileId: v.id('_storage'),
    fileUrl: v.string(),
    text: v.string(),
  }),

  speech_files: defineTable({
    fileId: v.id('_storage'),
    fileUrl: v.string(),
    resourceKey: v.string(),
    status: v.string(),
    textHash: v.string(),
    updatedAtTime: v.float64(),
  }),

  threads: defineTable({
    inference: v.object({
      endpoint: v.string(),
      endpointModelId: v.string(),
      height: v.optional(v.float64()),
      n: v.optional(v.float64()),
      prompt: v.optional(v.string()),
      resourceKey: v.string(),
      stream: v.optional(v.boolean()),
      type: v.string(),
      width: v.optional(v.float64()),
    }),
    instructions: v.optional(v.string()),
    slashCommands: v.array(
      v.object({
        command: v.string(),
        commandType: v.string(),
        id: v.string(),
        inference: v.object({
          endpoint: v.string(),
          endpointModelId: v.string(),
          excludeHistoryMessagesByName: v.optional(v.array(v.string())),
          height: v.optional(v.float64()),
          maxHistoryMessages: v.optional(v.float64()),
          n: v.optional(v.float64()),
          prompt: v.optional(v.string()),
          resourceKey: v.string(),
          type: v.string(),
          width: v.optional(v.float64()),
        }),
      }),
    ),
    slug: v.string(),
    title: v.string(),
    updatedAtTime: v.float64(),
    userId: v.id('users'),
    voiceovers: v.optional(
      v.object({
        default: v.string(),
        names: v.array(
          v.object({
            name: v.string(),
            resourceKey: v.string(),
          }),
        ),
      }),
    ),
  }),

  users: defineTable({
    imageUrl: v.string(),
    name: v.string(),
    role: v.string(),
    tokenIdentifier: v.string(),
  }),

  users_api_keys: defineTable({
    secret: v.string(),
    userId: v.id('users'),
    valid: v.boolean(),
  }),
})
