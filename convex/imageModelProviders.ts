import { WithoutSystemFields } from 'convex/server'
import { internalMutation, internalQuery, query } from './_generated/server'
import type { ImageModelProvider } from './schema'

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
