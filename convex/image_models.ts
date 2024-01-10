import { v } from 'convex/values'
import z from 'zod'
import { api, internal } from './_generated/api'
import { DataModel, Doc, Id } from './_generated/dataModel'
import { internalAction, internalMutation, internalQuery, query } from './_generated/server'

export const getByCivitIds = internalQuery({
  args: { civit_ids: v.array(v.string()) },
  handler: async (ctx, { civit_ids }) => {
    const image_models = await ctx.db
      .query('image_models')
      .filter((q) => q.or(...civit_ids.map((id) => q.eq(q.field('civit_id'), id))))
      .collect()
    return image_models
  },
})

export const listAll = query(async (ctx) => {
  const models = await ctx.db.query('image_models').collect()
  return models
})

type ImageModel = Omit<Doc<'image_models'>, '_id' | '_creationTime'>

export const create = internalMutation(async (ctx, { data }: { data: ImageModel }) => {
  return await ctx.db.insert('image_models', data)
})

export const update = internalMutation(
  async (ctx, { id, data }: { id: Id<'image_models'>; data: Partial<ImageModel> }) => {
    await ctx.db.patch(id, data)
  },
)

export const registerModelsByCivitIds = internalAction({
  args: { civit_ids: v.array(v.string()) },
  handler: async (ctx, { civit_ids }) => {
    console.log(`[image_models] registering ${civit_ids.length} civit_ids`)

    const currentModels = await ctx.runQuery(internal.image_models.getByCivitIds, { civit_ids })
    console.log(`[image_models] existing: ${currentModels.length}`)

    for (const civit_id of civit_ids) {
      const currentModel = currentModels.find((m) => m.civit_id === civit_id)
      if (currentModel) {
        console.log(`[image_models] skip existing ${civit_id}`)
        continue
      }
      const civit_data = await fetchCivitModelData(civit_id)
      if (!civit_data) {
        console.log(`[images_models] skip new ${civit_id}`)
        continue
      }
      const parsed = civitaiModelSchema.parse(civit_data)

      const base_models = parsed.modelVersions.map((mv) => mv.baseModel)
      const has_sd15 = base_models.some((b) => b.includes('SD 1.5'))
      const has_sdxl = base_models.some((b) => b.includes('SDXL'))

      const type = parsed.type.toLowerCase()
      const images = parsed.modelVersions
        .map((mv) =>
          mv.images.map((img) => ({
            model_version_name: mv.name,
            type: img.type,
            nsfw: img.nsfw,
            url: img.url,
            width: img.width,
            height: img.height,
            hash: img.hash,
            file_id: null,
          })),
        )
        .flat()

      const newModel: ImageModel = {
        name: parsed.name,
        description: '',
        base: has_sd15 ? 'sd-1.5' : has_sdxl ? 'sdxl' : 'unknown',
        type: type === 'checkpoint' || type === 'lora' ? type : 'unknown',
        nsfw: parsed.nsfw,
        images,
        tags: ['_new'],

        civit_id,
        civit_data: {
          cache: { ...parsed, base_models },
          cache_time: new Date().toISOString(),
        },

        providers: [],

        hidden: false,
      }

      const id = await ctx.runMutation(internal.image_models.create, {
        data: newModel,
      })
      console.log(`[image_models] created`, newModel.name)
    }

    console.log('[image_models] done')
  },
})

const fetchCivitModelData = async (civit_id: string) => {
  console.log(`[image_models] GET civitai.com / ${civit_id}`)
  const response = await fetch(`https://civitai.com/api/v1/models/${civit_id}`)
  if (!response.ok) {
    console.error('civitai request failed:', response.statusText)
    return null
  }

  const json = await response.json()
  return json as unknown
}

const civitaiModelSchema = z.object({
  id: z.number().transform((v) => v.toString()),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  poi: z.boolean(),
  nsfw: z.boolean(),
  allowNoCredit: z.boolean(),
  allowCommercialUse: z.string(),
  allowDerivatives: z.boolean(),
  allowDifferentLicense: z.boolean(),
  stats: z.object({
    downloadCount: z.number(),
    favoriteCount: z.number(),
    commentCount: z.number(),
    ratingCount: z.number(),
    rating: z.number(),
    tippedAmountCount: z.number(),
  }),
  creator: z.object({ username: z.string(), image: z.string() }),
  tags: z.array(z.string()),
  modelVersions: z.array(
    z.object({
      id: z.number(),
      modelId: z.number(),
      name: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      status: z.string(),
      publishedAt: z.string(),
      trainedWords: z.array(z.unknown()),
      baseModel: z.string(),
      baseModelType: z.string(),
      earlyAccessTimeFrame: z.number(),
      description: z.string().nullable(),
      vaeId: z.unknown(),
      stats: z.object({
        downloadCount: z.number(),
        ratingCount: z.number(),
        rating: z.number(),
      }),
      files: z.any(),
      images: z.array(
        z.object({
          url: z.string(),
          nsfw: z.string(),
          width: z.number(),
          height: z.number(),
          hash: z.string(),
          type: z.string(),
          metadata: z.record(z.any()).transform((v) => JSON.stringify(v)),
          meta: z
            .record(z.any())
            .transform((v) => JSON.stringify(v))
            .nullable(),
        }),
      ),
      downloadUrl: z.string(),
    }),
  ),
})

const tempids = [
  '4384',
  '4694',
  '5043',
  '4201',
  '2220',
  '4201',
  '1116',
  '10028',
  '4823',
  '7240',
  '10415',
  '3079',
  '17754',
  '8542',
  '5041',
  '23521',
  '23900',
  '2504',
  '11866',
  '2583',
  '12606',
  '2220',
  '36520',
  '25494',
  '43331',
  '8281',
  '62778',
  '81458',
  '79754',
  '28059',
  '18798',
  '25694',
  '47274',
  '15003',
  '133005',
  '2220',
  '132632',
  '107842',
  '94809',
  '107289',
]
