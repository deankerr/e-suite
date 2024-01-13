import { api, internal } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { internalAction, internalMutation, internalQuery, query } from './_generated/server'
import type { ImageModelProvider } from './schema'

export const list = internalQuery(
  async (ctx) => await ctx.db.query('imageModelProviders').collect(),
)

export const listByProvider = internalQuery(
  async (ctx, { key }: { key: ImageModelProvider['key'] }) =>
    await ctx.db
      .query('imageModelProviders')
      .withIndex('by_providerKey', (q) => q.eq('key', key))
      .collect(),
)

export const create = internalMutation(
  async (ctx, { doc }: { doc: ImageModelProvider }) =>
    await ctx.db.insert('imageModelProviders', doc),
)
