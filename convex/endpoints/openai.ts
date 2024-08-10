import { v } from 'convex/values'

import { internalMutation } from '../functions'

import type { Doc } from '../_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

const endpoint = 'openai'

const definitions = [
  {
    modelId: 'gpt-4o',
    name: 'GPT-4o',
    contextLength: 128000,
    pricing: { type: 'llm' as const, tokenInput: 5, tokenOutput: 15 },
  },
  {
    modelId: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    contextLength: 128000,
    pricing: { type: 'llm' as const, tokenInput: 0.15, tokenOutput: 0.6 },
  },
  {
    modelId: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    contextLength: 128000,
    pricing: { type: 'llm' as const, tokenInput: 10, tokenOutput: 30 },
  },
  {
    modelId: 'gpt-4',
    name: 'GPT-4',
    contextLength: 8192,
    pricing: { type: 'llm' as const, tokenInput: 30, tokenOutput: 60 },
  },
  {
    modelId: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    contextLength: 16385,
    pricing: { type: 'llm' as const, tokenInput: 0.5, tokenOutput: 1.5 },
  },
]

export const chatModelData: WithoutSystemFields<Doc<'chat_models'>>[] = definitions.map((m) => ({
  ...m,
  resourceKey: `openai::${m.modelId}`,
  endpoint: 'openai',
  modelId: m.modelId,
  endpointModelId: m.modelId,

  description: '',
  creatorName: 'OpenAI',
  link: 'https://openai.com/',
  license: '',
  tags: [],

  tokenizer: 'GPT',

  moderated: false,
  available: true,
  hidden: false,
  internalScore: 0,

  type: 'chat',
}))

export const importChatModels = internalMutation({
  args: {
    replace: v.optional(v.boolean()),
  },
  handler: async (ctx, { replace = false }) => {
    console.info(endpoint, 'importing models')

    for (const model of chatModelData) {
      const existing = await ctx
        .table('chat_models')
        .filter((q) => q.eq(q.field('resourceKey'), model.resourceKey))
        .first()
      if (existing) {
        if (replace) await existing.replace(model)
      } else {
        await ctx.table('chat_models').insert(model)
        console.info(endpoint, 'created new model', model.name, model.resourceKey)
      }
    }
  },
})

const voices = ['Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer']

export const getNormalizedVoiceModelData = () => {
  return voices.map((voice) => ({
    resourceKey: `openai::${voice.toLowerCase()}`,
    endpointModelId: voice.toLowerCase(),
    name: voice,
    creatorName: 'OpenAI',
    endpoint: 'openai',
    accent: '',
    gender: '',
  }))
}

export const OpenAIImageModels = [
  {
    model_id: 'dall-e-3',
    name: 'dall-e-3',
    creatorName: 'OpenAI',
  },
  {
    model_id: 'dall-e-2',
    name: 'dall-e-2',
    creatorName: 'OpenAI',
  },
]
