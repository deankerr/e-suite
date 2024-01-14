import { WithoutSystemFields } from 'convex/server'
import { v } from 'convex/values'
import { internalMutation, internalQuery, query } from './_generated/server'
import type { ImageModelProvider } from './types'

export const imageModelProviderFields = {
  key: v.union(v.literal('openai'), v.literal('sinkin')),
  providerModelId: v.string(),
  providerModelData: v.any(),
  imageModelId: v.union(v.id('imageModels'), v.null()),
  hidden: v.boolean(),
}

export const list = query(async (ctx) => await ctx.db.query('imageModelProviders').collect())

export const listByProvider = internalQuery(
  async (ctx, { key }: { key: ImageModelProvider['key'] }) =>
    await ctx.db
      .query('imageModelProviders')
      .withIndex('by_providerKey', (q) => q.eq('key', key))
      .collect(),
)

export const create = internalMutation(
  async (ctx, { doc }: { doc: WithoutSystemFields<ImageModelProvider> }) =>
    await ctx.db.insert('imageModelProviders', doc),
)
