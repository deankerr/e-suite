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
    apiKeys: apiKeysEnt,
    clerkWebhookEvents: clerkWebhookEventsEnt,
    generations: generationsEnt,
    images: imagesEnt,
    imageModels: imageModelEnt,
    messages: messagesEnt,
    threads: threadsEnt,
    users: usersEnt,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
