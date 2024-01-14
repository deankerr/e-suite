import { WithoutSystemFields } from 'convex/server'
import { v } from 'convex/values'
import { Doc, Id } from './_generated/dataModel'
import { internalMutation, internalQuery, query } from './_generated/server'
import { ImageModel } from './types'
import { raise } from './util'

export const imageModelFields = {
  name: v.string(),
  description: v.string(),
  base: v.union(v.literal('dalle'), v.literal('sd1.5'), v.literal('sdxl'), v.literal('unknown')),
  type: v.union(v.literal('checkpoint'), v.literal('lora'), v.literal('unknown')),
  nsfw: v.union(
    v.literal('unclassified'),
    v.literal('safe'),
    v.literal('low'),
    v.literal('high'),
    v.literal('x'),
  ),
  images: v.array(v.string()),
  tags: v.array(v.string()),

  civitaiId: v.union(v.string(), v.null()),
  civitaiModelDataId: v.union(v.id('civitaiModelData'), v.null()),

  sinkinProviderId: v.optional(v.id('imageModelProviders')),
  sinkinApiModelId: v.optional(v.string()),

  hidden: v.boolean(),
}

export const list = query(async (ctx) => await ctx.db.query('imageModels').collect())

export const listByCivitaiId = internalQuery(
  async (ctx) => await ctx.db.query('imageModels').withIndex('by_civitaiId').collect(),
)

export const getByCivitaiId = internalQuery(
  async (ctx, { civitaiId }: { civitaiId: string }) =>
    await ctx.db
      .query('imageModels')
      .withIndex('by_civitaiId', (q) => q.eq('civitaiId', civitaiId))
      .first(),
)

export const create = internalMutation(
  async (ctx, { doc }: { doc: WithoutSystemFields<ImageModel> }) => {
    const id = await ctx.db.insert('imageModels', { ...doc })
    // if (doc.civitaiId)
    //   await ctx.scheduler.runAfter(0, internal.imageModels.addCivitaiData, {
    //     id,
    //     civitaiId: doc.civitaiId,
    //   })
    return id
  },
)

export const update = internalMutation(
  async (ctx, { doc }: { doc: Partial<Doc<'imageModels'>> }) => {
    await ctx.db.patch(doc._id ?? raise('imageModel update missing _id'), doc)
  },
)

// export const addCivitaiData = internalAction(
//   async (ctx, { id, civitaiId }: { id: Id<'imageModels'>; civitaiId: string }) => {
//     const civitaiModelDataId = await ctx.runMutation(internal.providers.civitai.registerCivitaiId, {
//       civitaiId,
//     })
//     await ctx.runMutation(internal.imageModels.update, {
//       doc: {
//         _id: id,
//         civitaiModelDataId,
//       },
//     })
//   },
// )
