import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const imageModelBases = v.union(
  v.literal('dall-e'),
  v.literal('sd-1.5'),
  v.literal('sdxl'),
  v.literal('unknown'),
)
const imageModelTypes = v.union(v.literal('checkpoint'), v.literal('lora'), v.literal('unknown'))

export default defineSchema(
  {
    generations: defineTable({
      model_id: v.string(),
      provider_id: v.string(),
      base: imageModelBases,

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

    image_models: defineTable({
      name: v.string(),
      description: v.string(),
      base: imageModelBases,
      type: imageModelTypes,
      nsfw: v.boolean(),
      images: v.array(
        v.object({
          model_version_name: v.string(),
          type: v.string(),
          nsfw: v.string(),
          url: v.string(),
          width: v.number(),
          height: v.number(),
          hash: v.string(),
          file_id: v.union(v.id('_storage'), v.null()),
        }),
      ),
      tags: v.array(v.string()),

      civit_id: v.union(v.string(), v.null()),
      civit_data: v.union(
        v.object({
          cache: v.any(),
          cache_time: v.string(),
        }),
        v.null(),
      ),

      providers: v.array(v.object({ id: v.id('image_providers'), ref: v.string() })),

      hidden: v.boolean(),
    }),

    image_providers: defineTable({
      name: v.string(),
      url: v.string(),
      models_data: v.union(
        v.object({
          cache: v.any(),
          cache_time: v.string(),
        }),
        v.null(),
      ),
    }),
  },
  {
    strictTableNameTypes: false, // allow tables without schema
  },
)
