import { defineSchema, defineTable } from 'convex/server'
import { authTokensTable } from './authTokens'
import { imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelTable } from './imageModels'
import { usersTable } from './users'

export default defineSchema(
  {
    authTokens: authTokensTable,
    images: imagesTable,
    imageModels: imageModelTable,
    generations: generationsTable,
    users: usersTable,
  },
  {
    strictTableNameTypes: false, // allow tables without schema
    schemaValidation: false,
  },
)
