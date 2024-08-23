import { v } from 'convex/values'

import { internal } from '../_generated/api'
import * as Aws from '../endpoints/aws'
import * as ElevenLabs from '../endpoints/elevenlabs'
import * as OpenAi from '../endpoints/openai'
import { internalAction, internalMutation, query } from '../functions'
import { chatModelFields, imageModelFields } from '../schema'
import { QueryCtx } from '../types'

import type { Doc } from '../_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

// * chat models
export const shapeChatModel = (
  data: Omit<WithoutSystemFields<Doc<'chat_models'>>, 'resourceKey' | 'type'>,
): WithoutSystemFields<Doc<'chat_models'>> => {
  return {
    ...data,
    type: 'chat' as const,
    resourceKey: `${data.endpoint}::${data.endpointModelId}`,
  }
}

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

// * image models
export const shapeImageModel = (
  data: Omit<WithoutSystemFields<Doc<'image_models'>>, 'resourceKey' | 'type'>,
): WithoutSystemFields<Doc<'image_models'>> => {
  return {
    ...data,
    type: 'image' as const,
    resourceKey: `${data.endpoint}::${data.endpointModelId}`,
  }
}

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
  args: {
    endpoint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const models = await ctx
      .table('image_models')
      .filter((q) => {
        if (args.endpoint) {
          return q.eq(q.field('endpoint'), args.endpoint)
        }
        return true
      })
      .map((model) => ({ ...model, type: 'image' as const }))

    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})

export const createImageModel = internalMutation({
  args: {
    ...imageModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('image_models').insert(args)
  },
})

export const updateImageModel = internalMutation({
  args: {
    id: v.id('image_models'),
    ...imageModelFields,
    resourceKey: v.string(),
  },
  handler: async (ctx, { id, ...args }) => {
    return await ctx.table('image_models').getX(id).replace(args)
  },
})

// * voice models
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

// * admin
export const importEndpointModels = internalAction(async (ctx) => {
  await ctx.runMutation(internal.db.admin.events.log, {
    type: 'info',
    message: 'Importing endpoint models',
  })

  await ctx.runMutation(internal.endpoints.openai.importChatModels, {})
  await ctx.runMutation(internal.endpoints.fal.importImageModels, {})

  await ctx.runAction(internal.endpoints.openrouter.importChatModels, {})
  await ctx.runAction(internal.endpoints.together.importChatModels, {})
})
