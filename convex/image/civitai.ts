import z from 'zod'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalAction, internalMutation } from '../_generated/server'

export const create = internalMutation(async (ctx, data) => {
  return await ctx.db.insert('civitai_model_cache', data)
})

//TODO return cached data if available
export const fetchModelDataForId = internalAction(
  async (ctx, { civit_id }: { civit_id: string }): Promise<Id<'civitai_model_cache'> | null> => {
    const data = await fetchModel(civit_id)
    if (!data) return null
    console.log(`[civitai] ${data.id} ${data.name}`)
    const result = await ctx.runMutation(internal.image.civitai.create, data)
    return result
  },
)

const fetchModel = async (civit_id: string) => {
  console.log(`[civitai] /api/v1/models/${civit_id}`)
  const response = await fetch(`https://civitai.com/api/v1/models/${civit_id}`)
  if (!response.ok) {
    console.error('[civitai] request failed:', response.statusText)
    return null
  }
  const json = await response.json()
  return civitaiModelSchema.parse(json)
}

const civitaiModelSchema = z.object({
  id: z.coerce.string(),
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
      trainedWords: z.array(z.string()),
      baseModel: z.string(),
      baseModelType: z.string(),
      earlyAccessTimeFrame: z.number(),
      description: z.string().nullable(),
      vaeId: z.number().nullable(),
      stats: z.object({
        downloadCount: z.number(),
        ratingCount: z.number(),
        rating: z.number(),
      }),
      files: z.array(z.unknown()),
      images: z.array(
        z.object({
          url: z.string(),
          nsfw: z.string(),
          width: z.number(),
          height: z.number(),
          hash: z.string(),
          type: z.string(),
          metadata: z.record(z.unknown()),
          meta: z
            .record(z.unknown())
            .transform((v) => JSON.stringify(v))
            .nullable(),
        }),
      ),
      downloadUrl: z.string(),
    }),
  ),
})
