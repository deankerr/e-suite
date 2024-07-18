import * as Aws from '../endpoints/aws'
import * as ElevenLabs from '../endpoints/elevenlabs'
import * as OpenAi from '../endpoints/openai'
import { query } from '../functions'
import { QueryCtx } from '../types'

export const getChatModelByResourceKey = async (ctx: QueryCtx, resourceKey: string) => {
  const model = await ctx
    .table('chat_models', 'resourceKey', (q) => q.eq('resourceKey', resourceKey))
    .unique()
  if (!model) return null

  return { ...model, type: 'chat' as const }
}

export const listChatModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx
      .table('chat_models')
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
