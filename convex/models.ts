import { asyncMap } from 'convex-helpers'

import { internal } from './_generated/api'
import { internalMutation, query } from './functions'
import FalModelsJson from './providers/fal.models.json'
import SinkinModelsJson from './providers/sinkin.models.json'
import TogetherAiModels from './providers/togetherai.models.json'

import type { api } from './_generated/api'
import type { FunctionReturnType } from 'convex/server'

export type Temp_EModels = FunctionReturnType<typeof api.models.listImageModels>

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
        .table('app_images', 'sourceUrl', (q) => q.eq('sourceUrl', model.cover_image))
        .first(),
    }))

    return models
  },
})

export const importCoverImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const model of modelsList) {
      await ctx.scheduler.runAfter(0, internal.app_images.importUrl, { url: model.cover_image })
    }
  },
})

const chatModels = TogetherAiModels.filter((m) => m.type === 'chat')

export const listChatModels = query({
  args: {},
  // eslint-disable-next-line @typescript-eslint/require-await
  handler: async () => {
    return chatModels
  },
})
