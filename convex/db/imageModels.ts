import { query } from '../functions'
import { QueryCtx } from '../types'

export const getImageModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('image_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null
  return { ...model, type: 'image' }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('image_models').map((model) => ({ ...model, type: 'image' }))
    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
})
