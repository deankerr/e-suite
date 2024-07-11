import { v } from 'convex/values'

import { query } from '../functions'
import { QueryCtx } from '../types'

export const getImageModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('image_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null
  return { ...model, type: 'image' as const }
}

export const get = query({
  args: {
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await getImageModelByResourceKey(ctx, args.resourceKey)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('image_models')
      .map((model) => ({ ...model, type: 'image' as const }))
    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
})
