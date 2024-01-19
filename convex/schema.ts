import { defineSchema, defineTable } from 'convex/server'
import { imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelProviderFields } from './imageModelProviders'
import { imageModelFields } from './imageModels'
import { usersTable } from './users'

export default defineSchema(
  {
    images: imagesTable,
    imageModels: defineTable(imageModelFields).index('by_civitaiId', ['civitaiId']),
    imageModelProviders: defineTable(imageModelProviderFields).index('by_providerKey', ['key']),

    generations: generationsTable,

    users: usersTable,
  },
  {
    strictTableNameTypes: false, // allow tables without schema
    schemaValidation: false,
  },
)

// civitaiModelData: defineTable(civitaiModelDataFields).index('by_civitaiId', ['civitaiId']),
