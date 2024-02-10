import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'
import { imagesEnt } from './files/images'
import { generationsEnt } from './generations'
import { imageModelEnt } from './imageModels'
import { messagesFields } from './threads/messages'
import { vEnum } from './util'

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

export const jobTypes = vEnum(['llm', 'throw'])

export const jobRefs = v.union(v.id('messages'), v.id('generations'))

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
      .edges('threads', { ref: 'ownerId' })
      .edge('apiKey', { optional: true, ref: 'ownerId' })
      .field('tokenIdentifier', v.string(), { index: true }),
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
