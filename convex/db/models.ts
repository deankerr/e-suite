import { v } from 'convex/values'

import * as Aws from '../endpoints/aws'
import * as ElevenLabs from '../endpoints/elevenlabs'
import * as OpenAi from '../endpoints/openai'
import { internalMutation, query } from '../functions'
import { chatModelFields } from '../schema'
import { QueryCtx } from '../types'

import type { Doc } from '../_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

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

export const getImageModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('image_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null

  return { ...model, type: 'image' as const }
}

export const getImageModel = query({
  args: { resourceKey: v.string() },
  handler: async (ctx, args) => {
    return await getImageModelByResourceKey(ctx, args.resourceKey)
  },
})

export const listImageModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('image_models')
      .map((model) => ({ ...model, type: 'image' as const }))

    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})

export const getVoiceModels = () => {
  const models = [
    OpenAi.getNormalizedVoiceModelData(),
    Aws.getNormalizedVoiceModelData(),
    ElevenLabs.getNormalizedVoiceModelData(),
  ]
    .flat()
    .map((model) => ({ ...model, type: 'voice' as const }))

  return models
}

export const listVoiceModels = query({
  args: {},
  handler: async () => {
    return getVoiceModels()
  },
})

export const shapeChatModel = (
  data: Omit<WithoutSystemFields<Doc<'chat_models'>>, 'resourceKey' | 'type'>,
): WithoutSystemFields<Doc<'chat_models'>> => {
  return {
    ...data,
    type: 'chat' as const,
    resourceKey: `${data.endpoint}::${data.endpointModelId}`,
  }
}

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
