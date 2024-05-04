import { asyncMap } from 'convex-helpers'

import { internal } from './_generated/api'
import { internalMutation, query } from './functions'
import FalModelsJson from './providers/fal.models.json'
import SinkinModelsJson from './providers/sinkin.models.json'

const falAvailableIds = [
  'fal-ai/hyper-sdxl',
  'fal-ai/fast-lightning-sdxl',
  'fal-ai/pixart-sigma',
  'fal-ai/lora',
]

const fal = FalModelsJson.filter(({ model_id }) => falAvailableIds.includes(model_id)).map(
  (model) => ({ ...model, provider: 'fal' as const }),
)
const sinkin = SinkinModelsJson.map((model) => ({ ...model, provider: 'sinkin' as const }))

export const modelsList = [fal, sinkin].flat()

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await asyncMap(modelsList, async (model) => ({
      ...model,
      appImage: await ctx
        .table('app_images', 'sourceUrl', (q) => q.eq('sourceUrl', model.cover_image!))
        .first(),
    }))

    return models
  },
})

export const importCoverImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const model of modelsList) {
      try {
        await ctx.scheduler.runAfter(0, internal.app_images.importUrl, { url: model.cover_image! })
      } catch (err) {
        console.error(err)
      }
    }
  },
})
