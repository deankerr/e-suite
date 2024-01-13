import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { Doc } from './_generated/dataModel'

export type ImageModel = Omit<Doc<'imageModels'>, '_id' | '_creationTime'>
export type ImageModelProvider = Omit<Doc<'imageModelProviders'>, '_id' | '_creationTime'>
export type ProviderKey = (typeof imageProviderKeysList)[number]

const imageModelBases = v.union(
  v.literal('dall-e'),
  v.literal('sd1.5'),
  v.literal('sdxl'),
  v.literal('unknown'),
)
const imageModelTypes = v.union(v.literal('checkpoint'), v.literal('lora'), v.literal('unknown'))
const nsfwRating = v.union(
  v.literal('unclassified'),
  v.literal('safe'),
  v.literal('low'),
  v.literal('high'),
  v.literal('x'),
)
const imageProviderKeysList = ['openai', 'sinkin'] as const
const imageProviderKeys = v.union(v.literal('openai'), v.literal('sinkin'))

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

    imageModels: defineTable({
      name: v.string(),
      description: v.string(),
      base: imageModelBases,
      type: imageModelTypes,
      nsfw: nsfwRating,
      images: v.array(
        v.object({
          nsfw: nsfwRating,
          url: v.string(),
          width: v.number(),
          height: v.number(),
          hash: v.string(),
          file_id: v.union(v.id('_storage'), v.null()),
        }),
      ),
      tags: v.array(v.string()),

      civitaiId: v.union(v.string(), v.null()),
      civitaiModelDataId: v.union(v.id('civitaiModelData'), v.null()),

      providers: v.object({
        openai: v.union(v.id('imageModelProviders'), v.null()), //TODO make this array
        sinkin: v.union(v.id('imageModelProviders'), v.null()),
      }),

      hidden: v.boolean(),
    }).index('by_civitaiId', ['civitaiId']),

    imageModelProviders: defineTable({
      key: imageProviderKeys,
      providerModelId: v.string(),
      providerModelData: v.any(),
      imageModelId: v.union(v.id('imageModels'), v.null()),
      hidden: v.boolean(),
    }).index('by_providerKey', ['key']),

    civitaiModelData: defineTable({
      civitaiId: v.string(),
      modelData: v.any(),
    }),
  },
  {
    strictTableNameTypes: false, // allow tables without schema
  },
)
