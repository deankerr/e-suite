import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { v } from 'convex/values'
import { imagesEnt } from './files/images'
import { generationsEnt } from './generations'
import { imageModelEnt } from './imageModels'
import { messagesEnt } from './llm/messages'
import { clerkWebhookEventsEnt } from './providers/clerk'
import { usersEnt } from './users'

const schema = defineEntSchema(
  {
    apiKeys: defineEnt({
      secret: v.string(),
    })
      .edge('user', { field: 'ownerId' })
      .deletion('soft'),
    clerkWebhookEvents: clerkWebhookEventsEnt.deletion('soft'),
    generations: generationsEnt.deletion('soft'),
    images: imagesEnt.deletion('soft'),
    imageModels: imageModelEnt.deletion('soft'),
    messages: messagesEnt.deletion('soft'),
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
