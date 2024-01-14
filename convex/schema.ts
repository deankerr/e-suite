import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { imagesFields } from './files/images'
import { imageModelProviderFields } from './imageModelProviders'
import { imageModelFields } from './imageModels'

export default defineSchema(
  {
    images: defineTable(imagesFields).index('by_sourceUrl', ['sourceUrl']),

    generations: defineTable({
      model_id: v.string(),
      provider_id: v.string(),
      base: v.union(
        v.literal('dalle'),
        v.literal('sd1.5'),
        v.literal('sdxl'),
        v.literal('unknown'),
      ),

      num_images: v.number(),
      width: v.number(),
      height: v.number(),
      prompt: v.string(),
      seed: v.number(),

      files: v.array(v.id('_storage')),
      parameters: v.any(),

      event_log: v.array(
        v.object({
          type: v.string(),
          time: v.string(),
          data: v.any(),
        }),
      ),
      status: v.union(
        v.literal('pending'),
        v.literal('complete'),
        v.literal('failed'),
        v.literal('in_progress'),
        v.literal('cancelled'),
      ),

      hidden: v.boolean(),
    }),

    imageModels: defineTable(imageModelFields).index('by_civitaiId', ['civitaiId']),
    imageModelProviders: defineTable(imageModelProviderFields).index('by_providerKey', ['key']),
    // civitaiModelData: defineTable(civitaiModelDataFields).index('by_civitaiId', ['civitaiId']),
  },
  {
    strictTableNameTypes: false, // allow tables without schema
  },
)
