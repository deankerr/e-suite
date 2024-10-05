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

  return { ...model, description: '' }
}

export const listChatModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('chat_models')
      .filter((q) => q.and(q.eq(q.field('hidden'), false), q.eq(q.field('available'), true)))
      .map((model) => ({ ...model, description: '' }))

    return models.sort((a, b) => a.name.localeCompare(b.name))
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
