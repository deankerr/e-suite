import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { internalAction, internalMutation, query } from './_generated/server'
import { ImageModel, ProviderKey } from './schema'

export const list = query(async (ctx) => await ctx.db.query('imageModels').collect())

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

export const create = internalMutation(
  async (ctx, { doc }: { doc: ImageModel }) => await ctx.db.insert('imageModels', doc),
)

export const updateProviders = internalMutation(
  async (
    ctx,
    { _id, providers }: { _id: Id<'imageModels'>; providers: Doc<'imageModels'>['providers'] },
  ) => {
    await ctx.db.patch(_id, { providers })
  },
)
