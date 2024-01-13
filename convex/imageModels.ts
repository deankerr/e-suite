import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { internalAction, internalMutation, internalQuery, query } from './_generated/server'
import { ImageModel, ProviderKey } from './schema'
import { raise } from './util'

export const list = query(async (ctx) => await ctx.db.query('imageModels').collect())

export const listByCivitaiId = internalQuery(
  async (ctx) => await ctx.db.query('imageModels').withIndex('by_civitaiId').collect(),
)

export const getByCivitaiId = query({
  args: {
    civitaiId: v.string(),
  },
  handler: async (ctx, { civitaiId }) =>
    await ctx.db
      .query('imageModels')
      .withIndex('by_civitaiId', (q) => q.eq('civitaiId', civitaiId))
      .first(),
})

export const create = internalMutation(async (ctx, { doc }: { doc: ImageModel }) => {
  const id = await ctx.db.insert('imageModels', { ...doc })
  if (doc.civitaiId)
    await ctx.scheduler.runAfter(0, internal.imageModels.addCivitaiData, {
      id,
      civitaiId: doc.civitaiId,
    })
  return id
})

export const updateProvider = internalMutation(
  async (
    ctx,
    {
      _id,
      providerKey,
      providerId,
    }: { _id: Id<'imageModels'>; providerKey: ProviderKey; providerId: Id<'imageModelProviders'> },
  ) => {
    await ctx.db.patch(_id, { [providerKey]: providerId })
  },
)

export const update = internalMutation(
  async (ctx, { doc }: { doc: Partial<Doc<'imageModels'>> }) => {
    await ctx.db.patch(doc._id ?? raise('imageModel update missing _id'), doc)
  },
)

export const addCivitaiData = internalAction(
  async (ctx, { id, civitaiId }: { id: Id<'imageModels'>; civitaiId: string }) => {
    const civitaiModelDataId = await ctx.runMutation(internal.image.civitai.registerCivitaiId, {
      civitaiId,
    })
    await ctx.runMutation(internal.imageModels.update, {
      doc: {
        _id: id,
        civitaiModelDataId,
      },
    })
  },
)
