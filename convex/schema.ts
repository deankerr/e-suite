import { defineSchema } from 'convex/server'
import { authTokensTable } from './authTokens'
import { messagesTable } from './chat/messages'
import { threadsTable } from './chat/threads'
import { imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelTable } from './imageModels'
import { jobsTable } from './jobs'
import { usersTable } from './users'

export default defineSchema(
  {
    authTokens: authTokensTable,
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
