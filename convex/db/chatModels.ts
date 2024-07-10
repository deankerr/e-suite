import { query } from '../functions'
import { QueryCtx } from '../types'

export const getChatModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('chat_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null
  return { ...model, type: 'chat' as const }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('chat_models')
      .map((model) => ({ ...model, type: 'chat' as const, description: '' }))
    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})
