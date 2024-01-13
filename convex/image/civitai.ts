import z from 'zod'
import { internal } from '../_generated/api'
import { Doc, Id } from '../_generated/dataModel'
import { internalAction, internalMutation, internalQuery } from '../_generated/server'
import { invariant } from '../util'

const cacheTime = 24 * 60 * 60 * 1000

export const get = internalQuery(async (ctx, { id }: { id: Id<'civitaiModelData'> }) => {
  return await ctx.db.get(id)
})

export const registerCivitaiId = internalMutation(
  async (ctx, { civitaiId }: { civitaiId: string }) => {
    const existingRecord = await ctx.db
      .query('civitaiModelData')
      .withIndex('by_civitaiId', (q) => q.eq('civitaiId', civitaiId))
      .unique()

    if (existingRecord) return existingRecord._id
    return await create(ctx, { civitaiId })
  },
)

export const create = internalMutation(async (ctx, { civitaiId }: { civitaiId: string }) => {
  const id = await ctx.db.insert('civitaiModelData', {
    civitaiId,
    updatedAt: 0,
    json: null,
  })

  await ctx.scheduler.runAfter(0, internal.image.civitai.refresh, { id })
  return id
})

export const update = internalMutation(async (ctx, { doc }: { doc: Doc<'civitaiModelData'> }) => {
  await ctx.db.patch(doc._id, { ...doc, updatedAt: Date.now() })
})

export const refresh = internalAction(async (ctx, { id }: { id: Id<'civitaiModelData'> }) => {
  const record = await ctx.runQuery(internal.image.civitai.get, { id })
  invariant(record, `no record for id: ${id}`)

  if (Date.now() - record.updatedAt < cacheTime) return `cache hit`

  const civitaiData = await apiGetModel(record.civitaiId)
  await ctx.runMutation(internal.image.civitai.update, {
    doc: {
      ...record,
      json: JSON.stringify(civitaiData.json) ?? record.json,
      error: civitaiData.error,
    },
  })

  return `updated`
})

const apiGetModel = async (civit_id: string) => {
  console.log(`[civitai] /api/v1/models/${civit_id}`)
  try {
    const response = await fetch(`https://civitai.com/api/v1/models/${civit_id}`)
    if (!response.ok) return { error: response.statusText }

    const json = await response.json()
    return { json: civitaiModelSchema.parse(json) }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`[civitai] request failed: ${err.message}`)
    } else throw err
  }
}

export type CivitaiModelDataJson = z.infer<typeof civitaiModelSchema>
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
