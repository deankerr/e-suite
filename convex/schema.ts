import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { imagesFields, imagesTable } from './files/images'
import { generationsTable } from './generations'
import { imageModelProviderFields } from './imageModelProviders'
import { imageModelFields } from './imageModels'

export default defineSchema(
  {
    images: imagesTable,
    imageModels: defineTable(imageModelFields).index('by_civitaiId', ['civitaiId']),
    imageModelProviders: defineTable(imageModelProviderFields).index('by_providerKey', ['key']),

    generations: generationsTable,
  },
  {
    strictTableNameTypes: false, // allow tables without schema
    schemaValidation: false,
  },
)

// civitaiModelData: defineTable(civitaiModelDataFields).index('by_civitaiId', ['civitaiId']),
