import { v } from 'convex/values'

import { internalMutation, query } from '../functions'
import { chatModelFields } from '../schema'
import { QueryCtx } from '../types'

// * chat models
export const getChatModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('chat_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null

  return { ...model, type: 'chat' as const }
}

export const listChatModels = query({
  args: {
    endpoint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const models = await ctx
      .table('chat_models')
      .filter((q) => {
        if (args.endpoint) {
          return q.eq(q.field('endpoint'), args.endpoint)
        }
        return true
      })
      .map((model) => ({ ...model, type: 'chat' as const, description: '' }))

    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})

export const createChatModel = internalMutation({
  args: {
    ...chatModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('chat_models').insert(args)
  },
})

export const updateChatModel = internalMutation({
  args: {
    id: v.id('chat_models'),
    ...chatModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.table('chat_models').getX(id).replace(args)
  },
})
