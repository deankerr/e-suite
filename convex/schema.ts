import { defineSchema } from 'convex/server'
import { agentsTable } from './agents/agents'
import { authTokensTable } from './authTokens'
import { imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelTable } from './imageModels'
import { jobsTable } from './jobs'
import { messagesTable } from './llm/messages'
import { threadsTable } from './llm/threads'
import { clerkWebhookEventsTable } from './providers/clerk'
import { usersTable } from './users'

export default defineSchema(
  {
    agents: agentsTable,
    authTokens: authTokensTable,
    clerkWebhookEvents: clerkWebhookEventsTable,
    generations: generationsTable,
    images: imagesTable,
    imageModels: imageModelTable,
    jobs: jobsTable,
    messages: messagesTable,
    threads: threadsTable,
    users: usersTable,
  },
  {
    strictTableNameTypes: false, // allow tables without schema
    schemaValidation: false,
  },
)
