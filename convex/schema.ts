import { defineEntSchema, getEntDefinitions } from 'convex-ents'
import { apiKeysEnt } from './apiKeys'
import { imagesEnt } from './files/images'
import { generationsEnt } from './generations'
import { imageModelEnt } from './imageModels'
import { messagesEnt } from './llm/messages'
import { threadsEnt } from './llm/threads'
import { clerkWebhookEventsEnt } from './providers/clerk'
import { usersEnt } from './users'

const schema = defineEntSchema(
  {
    apiKeys: apiKeysEnt.deletion('soft'),
    clerkWebhookEvents: clerkWebhookEventsEnt.deletion('soft'),
    generations: generationsEnt.deletion('soft'),
    images: imagesEnt.deletion('soft'),
    imageModels: imageModelEnt.deletion('soft'),
    messages: messagesEnt.deletion('soft'),
    threads: threadsEnt.deletion('soft'),
    users: usersEnt.deletion('soft'),
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
