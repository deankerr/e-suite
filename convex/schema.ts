import { defineSchema, defineTable } from 'convex/server'
import { imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelTable } from './imageModels'
import { usersTable } from './users'

export default defineSchema(
  {
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
