import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'
import { nsfwRatings } from './constants'
import { imagesEnt } from './files/images'
import { generationsEnt } from './generations'
import { imageModelEnt } from './imageModels'
import { messagesFields } from './threads/messages'
import { vEnum } from './util'

export const permissions = v.object({
  private: v.boolean(), // only visible by owner/author
  allowOnPublicFeeds: v.optional(v.boolean()),
  allowOtherUsersToEdit: v.optional(v.boolean()),
})

export const generationParameters = v.object({
  imageModelId: v.string(), //TODO v.id
  prompt: v.string(),
  negativePrompt: v.optional(v.string()),
  seed: v.optional(v.number()),
  scheduler: v.optional(v.string()),
  steps: v.optional(v.number()),
  guidance: v.optional(v.number()),
  lcm: v.optional(v.boolean()),
})

export const v2imagesFields = {
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
const v2images = defineEnt(v2imagesFields)
  .deletion('soft')
  .field('permissions', permissions, { default: { private: true } })
  .index('sourceUrl', ['sourceUrl'])

const v2generationsFields = {
  imageIds: v.array(v.id('v2images')),
}
const v2generations = defineEnt(v2generationsFields)
  .deletion('soft')
  .field('permissions', permissions, { default: { private: true } })
  .edge('user', { field: 'authorId' })

const jobStatusNames = vEnum([
  'pending',
  'active',
  'complete',
  'error',
  'streaming',
  'cancelled',
  'failed',
])

export const jobEventFields = {
  status: jobStatusNames,
  message: v.optional(v.string()),
  data: v.optional(v.any()),
}
export const jobTypes = vEnum(['llm', 'generation'])
export const jobRefs = v.union(v.id('messages'), v.id('v2images'))
export const jobFields = {
  type: jobTypes,
  ref: jobRefs,
  status: jobStatusNames,
  events: v.array(v.object({ ...jobEventFields, creationTime: v.number() })),
}

export const usersFields = {
  username: v.string(),
  avatar: v.string(),
  personal: v.object({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }),
  admin: v.boolean(),
}

const schema = defineEntSchema(
  {
    apiKeys: defineEnt({
      secret: v.string(),
    })
      .edge('user', { field: 'ownerId' })
      .deletion('soft'),

    clerkWebhookEvents: defineEnt({
      body: v.string(),
      id: v.string(),
      type: v.string(),
    }).deletion('soft'),
    generations: generationsEnt.deletion('soft'),

    v2generations,
    v2images,

    images: imagesEnt.deletion('soft'),

    imageModels: imageModelEnt.deletion('soft'),

    jobs: defineEnt(jobFields).deletion('soft'),

    messages: defineEnt(messagesFields).edge('thread', { field: 'threadId' }).deletion('soft'),

    threads: defineEnt({ name: v.string(), systemPrompt: v.string() })
      .edge('user', { field: 'ownerId' })
      .edges('messages', { ref: 'threadId', deletion: 'soft' })
      .deletion('soft'),

    users: defineEnt(usersFields)
      .deletion('soft')
      .edges('v2generations', { ref: 'authorId' })
      .edges('threads', { ref: 'ownerId' })
      .edge('apiKey', { optional: true, ref: 'ownerId' })
      .field('tokenIdentifier', v.string(), { index: true }),
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
