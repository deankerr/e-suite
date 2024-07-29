import { internalMutation } from '../functions'
import { getModelTags } from '../lib/modelTags'

import type { Doc } from '../_generated/dataModel'
import type { WithoutSystemFields } from 'convex/server'

const definitions = [
  {
    modelId: 'gpt-4o',
    name: 'GPT-4o',
    contextLength: 128000,
    pricing: { type: 'perMillionTokens', inputValue: 5, outputValue: 15 },
  },
  {
    modelId: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    contextLength: 128000,
    pricing: { type: 'perMillionTokens', inputValue: 0.15, outputValue: 0.6 },
  },
  {
    modelId: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    contextLength: 128000,
    pricing: { type: 'perMillionTokens', inputValue: 10, outputValue: 30 },
  },
  {
    modelId: 'gpt-4',
    name: 'GPT-4',
    contextLength: 8192,
    pricing: { type: 'perMillionTokens', inputValue: 30, outputValue: 60 },
  },
  {
    modelId: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    contextLength: 16385,
    pricing: { type: 'perMillionTokens', inputValue: 0.5, outputValue: 1.5 },
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

  numParameters: 0,
  tokenizer: 'GPT',
  stop: [],

  moderated: false,
  available: true,
  hidden: false,
  internalScore: 2,
}))

export const importChatModels = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const model of chatModelData) {
      const { tags, score } = getModelTags(model.endpointModelId)
      model.tags.push(...tags)
      model.internalScore = score

      const existing = await ctx
        .table('chat_models')
        .filter((q) => q.eq(q.field('resourceKey'), model.resourceKey))
        .first()
      if (existing) {
        await existing.replace(model)
      } else {
        await ctx.table('chat_models').insert(model)
      }
      console.log(model.name, model.internalScore, model.tags)
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
