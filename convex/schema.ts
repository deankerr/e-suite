import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'
import { imagesEnt } from './files/images'
import { generationsEnt } from './generations'
import { imageModelEnt } from './imageModels'
import { messagesFields } from './threads/messages'
import { usersEnt } from './users'
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
    threads: defineEnt({ name: v.string(), firstMessageId: v.optional(v.id('messages')) })
      .edge('user', { field: 'ownerId' })
      .edges('messages', { ref: 'threadId' })
      .deletion('soft'),
    users: usersEnt.deletion('soft'),
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
