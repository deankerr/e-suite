import { defineEnt } from 'convex-ents'
import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { ms } from 'itty-time'

// * refactored schema draft

// * this is a reference implementation only, to be removed after migration

const timeToDelete = ms('1 day')

export const imageFields = {
  // intrinsic image data
  fileId: v.id('_storage'),
  sourceUrl: v.string(),
  width: v.number(),
  height: v.number(),
  format: v.string(),
  blurDataUrl: v.string(),
  color: v.string(),

  // generated image data - post image creation
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
const image = defineEnt(imageFields)
  .deletion('scheduled', {
    delayMs: timeToDelete,
  })
  .edge('message')
  .edge('thread')
  .edge('user')
  .index('sourceUrl', ['sourceUrl'])
  .searchIndex('captionText', {
    searchField: 'captionText',
    filterFields: ['threadId', 'userId', 'nsfwProbability', 'generationData.modelId'],
  })

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

export const speechFields = {
  fileId: v.optional(v.id('_storage')),
  resourceKey: v.string(),
  textHash: v.string(),
}
const speech = defineEnt(speechFields)
  .index('textHash_resourceKey', ['textHash', 'resourceKey'])
  .edge('message')
  .edge('thread')
  .edge('user')

// * Messages
export const messageFields = {
  role: literals('system', 'assistant', 'user'),
  name: v.optional(v.string()),
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

  voiceover: v.optional(
    v.object({
      resourceKey: v.string(),
      speechId: v.optional(v.id('speech')),
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
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('image', { ref: true, deletion: 'soft' })
  .edges('speech', { ref: true, deletion: 'soft' })
  .index('threadId_series', ['threadId', 'series'])
  .index('speechId', ['voiceover.speechId'])
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
  updatedAtTime: v.number(),
}
const threads = defineEnt(threadFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('slug', v.string(), { unique: true })
  .edges('messages', { ref: true, deletion: 'soft' })
  .edges('image', { ref: true, deletion: 'soft' })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('speech', { ref: true, deletion: 'soft' })
  .edge('user')

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
  .edges('image', { ref: true, deletion: 'soft' })
  .edges('audio', { ref: true, deletion: 'soft' })
  .edges('speech', { ref: true, deletion: 'soft' })

export const usersApiKeysFields = {
  valid: v.boolean(),
}
const users_api_keys = defineEnt(usersApiKeysFields)
  .deletion('scheduled', { delayMs: timeToDelete })
  .field('secret', v.string(), { unique: true })
  .edge('user')
