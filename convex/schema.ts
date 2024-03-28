import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'

import { messageRoles, modelBases, modelTypes, nsfwRatings } from './constants'
import { vEnum } from './util'

import type { Infer } from 'convex/values'

export type GenerationParameters = Infer<typeof generationParameters>
export type Permissions = Infer<typeof permissionsFields>

export const permissionsFields = v.object({
  private: v.boolean(),
  allowOnPublicFeeds: v.optional(v.boolean()),
  allowOtherUsersToEdit: v.optional(v.boolean()),
})

export const jobFields = {
  type: vEnum(['inference', 'generation', 'downloadImage', 'voiceover']),
  status: vEnum(['pending', 'complete', 'error']),
  message: v.optional(v.string()),
  data: v.optional(v.any()),

  messageId: v.optional(v.id('messages')),
  imageId: v.optional(v.id('images')),
  voiceoverId: v.optional(v.id('voiceovers')),
}

export const usersFields = {
  username: v.string(),
  avatar: v.string(),
  personal: v.object({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }),
  isAdmin: v.boolean(),
}

//* Generations
const generationsFields = {
  imageIds: v.array(v.id('images')),
}

export const generationParameters = v.object({
  imageModelId: v.id('imageModels'),
  prompt: v.string(),
  negativePrompt: v.optional(v.string()),
  seed: v.optional(v.number()),
  scheduler: v.optional(v.string()),
  steps: v.optional(v.number()),
  guidance: v.optional(v.number()),
  lcm: v.optional(v.boolean()),
  n: v.optional(v.number()),
})

export const imageModelFields = {
  name: v.string(),
  description: v.string(),
  base: vEnum(modelBases),
  type: vEnum(modelTypes),
  nsfw: vEnum(nsfwRatings),
  imageId: v.id('images'),
  tags: v.array(v.string()),

  civitaiId: v.optional(v.string()),
  huggingFaceId: v.optional(v.string()),

  sinkin: v.optional(
    v.object({
      refId: v.string(),
      hidden: v.optional(v.boolean()),
    }),
  ),

  hidden: v.optional(v.boolean()),
}

//* Images
export const imagesFields = {
  storageId: v.optional(v.id('_storage')),
  url: v.optional(v.string()),

  sourceUrl: v.optional(v.string()),
  nsfw: vEnum(nsfwRatings),

  width: v.number(),
  height: v.number(),
  blurDataURL: v.string(),
  color: v.string(),
  metadata: v.any(),

  parameters: v.optional(generationParameters),
}

// * Messages
export const messageFields = {
  role: vEnum(['system', 'user', 'assistant', 'tool']),
  name: v.optional(v.string()),
  content: v.string(),
}

export const inferenceParametersFields = v.object({
  model: v.string(),
  max_tokens: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  temperature: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  repetition_penalty: v.optional(v.number()),
})

export const messagesFields = {
  ...messageFields,
  inferenceParameters: v.optional(inferenceParametersFields),
  speechId: v.optional(v.id('speech')),
}
const messages = defineEnt(messagesFields)
  .deletion('soft')
  .edge('thread', { field: 'threadId' })
  .edge('voiceover', { optional: true })

// * Speech
export const elevenlabsSpeechParametersFields = v.object({
  provider: v.literal('elevenlabs'),
  voice_id: v.string(),
  model_id: v.string(),
  voice_settings: v.optional(
    v.object({
      similarity_boost: v.optional(v.number()),
      stability: v.optional(v.number()),
      style: v.optional(v.number()),
      use_speaker_boost: v.optional(v.boolean()),
    }),
  ),
})

export const awsSpeechParametersFields = v.object({
  provider: v.literal('aws'),
  VoiceId: v.string(),
  Engine: vEnum(['neural', 'standard', 'long-form']),
})

export const speechFields = {
  text: v.string(),
  textHash: v.string(),
  storageId: v.optional(v.id('_storage')),

  voiceRef: v.string(),
  parameters: v.union(elevenlabsSpeechParametersFields, awsSpeechParametersFields),
}
const speech = defineEnt(speechFields).deletion('soft').index('textHash', ['textHash'])

// * Threads
export const threadsFields = {
  title: v.optional(v.string()),
  systemPrompt: v.optional(v.string()),
  name: v.optional(v.string()),
  parameters: v.optional(inferenceParametersFields),
  permissions: permissionsFields,
  voices: v.optional(
    v.array(
      v.object({
        role: vEnum(messageRoles),
        name: v.optional(v.string()),
        voiceRef: v.string(),
      }),
    ),
  ),
}
const threads = defineEnt(threadsFields)
  .edge('user')
  .edges('messages', { ref: 'threadId', deletion: 'soft' })
  .deletion('soft')

// * Voiceovers
export const voiceoversFields = {
  text: v.string(),
  textSha256: v.string(),
  storageId: v.optional(v.id('_storage')),

  provider: vEnum(['elevenlabs', 'aws']),
  parameters: v.union(
    v.object({
      elevenlabs: v.object({
        voice_id: v.optional(v.string()),
        model_id: v.optional(v.string()),
        voice_settings: v.optional(
          v.object({
            similarity_boost: v.optional(v.number()),
            stability: v.optional(v.number()),
            style: v.optional(v.number()),
            use_speaker_boost: v.optional(v.boolean()),
          }),
        ),
      }),
    }),

    v.object({
      aws: v.object({
        VoiceId: v.string(),
        Engine: vEnum(['neural', 'standard', 'long-form']),
      }),
    }),
  ),
}
const voiceovers = defineEnt(voiceoversFields)
  .deletion('soft')
  .edge('message')
  .index('textSha256', ['textSha256'])

const schema = defineEntSchema(
  {
    apiKeys: defineEnt({
      secret: v.string(),
    })
      .deletion('soft')
      .edge('user', { field: 'ownerId' })
      .index('secret', ['secret']),

    clerkWebhookEvents: defineEnt({
      body: v.string(),
      id: v.string(),
      type: v.string(),
    }).deletion('soft'),

    generations: defineEnt(generationsFields)
      .deletion('soft')
      .field('permissions', permissionsFields, { default: { private: true } })
      .edge('user', { field: 'authorId' }),

    images: defineEnt(imagesFields)
      .deletion('soft')
      .field('permissions', permissionsFields, { default: { private: true } })
      .index('sourceUrl', ['sourceUrl']),

    imageModels: defineEnt(imageModelFields)
      .deletion('soft')
      .field('order', v.number(), { index: true }),

    jobs: defineEnt(jobFields)
      .deletion('soft')
      .index('messageId', ['messageId'])
      .index('imageId', ['imageId'])
      .index('voiceoverId', ['voiceoverId']),

    messages,
    speech,
    threads,

    users: defineEnt(usersFields)
      .deletion('soft')
      .edges('generations', { ref: 'authorId' })
      .edges('threads', { ref: true })
      .edge('apiKey', { optional: true, ref: 'ownerId' })
      .field('tokenIdentifier', v.string(), { index: true }),

    voiceovers,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
