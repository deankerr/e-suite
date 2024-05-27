import { asyncMap } from 'convex-helpers'

import { query } from './functions'
import FalModelsJson from './providers/fal.models.json'
import { openai } from './providers/openai'
import OpenRouterModelsJson from './providers/openrouter.models.json'
import SinkinModelsJson from './providers/sinkin.models.json'
import TogetherAiModels from './providers/togetherai.models.json'

import type { api } from './_generated/api'
import type { FunctionReturnType } from 'convex/server'

export type Temp_EModels = FunctionReturnType<typeof api.bmodels.listImageModels>

const falAvailableIds = [
  'fal-ai/hyper-sdxl',
  'fal-ai/fast-lightning-sdxl',
  'fal-ai/pixart-sigma',
  'fal-ai/lora',
]

const fal = FalModelsJson.filter(({ model_id }) => falAvailableIds.includes(model_id)).map(
  (model) => ({ ...model, provider: 'fal' as const, resId: `${'fal'}:${model.model_id}` }),
)

const sinkin = SinkinModelsJson.map((model) => ({
  ...model,
  provider: 'sinkin' as const,
  resId: `${'sinkin'}:${model.model_id}`,
}))

export const modelsList = [fal, sinkin].flat()

export const listImageModels = query({
  args: {},
  handler: async (ctx) => {
    const models = await asyncMap(modelsList, async (model) => ({
      ...model,
      image: await ctx
        .table('images', 'originUrl', (q) => q.eq('originUrl', model.cover_image))
        .first(),
    }))

    return models
  },
})

export const listChatModels = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/require-await
  handler: async () => {
    const models = [
      TogetherAiModels.filter((m) => m.type === 'chat').map((model) => ({
        model_id: model.model_id,
        name: model.name,
        creator: model.creatorName,
        type: model.type,
        contextLength: model.contextLength,
        endpoint: 'together',
      })),
      openai.models.chat.map((model) => ({ ...model, type: 'chat', endpoint: 'openai' })),
      OpenRouterModelsJson.map((model) => ({
        model_id: model.id,
        name: model.name,
        contextLength: model.context_length,
        type: 'chat',
        endpoint: 'openrouter',
      })),
    ].flat()

    return models
  },
})
