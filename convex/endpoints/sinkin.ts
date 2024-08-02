import ky from 'ky'
import { z } from 'zod'

import { api, internal } from '../_generated/api'
import { shapeImageModel } from '../db/models'
import { internalAction } from '../functions'
import { env } from '../shared/utils'

const endpoint = 'sinkin'

export const fetchModelData = async () => {
  console.log('https://sinkin.ai/api/models')
  const body = new FormData()
  body.append('access_token', env('SINKIN_API_KEY'))
  const response = await ky.post('https://sinkin.ai/api/models', { body }).json()
  return response
}

const modelDataSchema = z.object({
  loras: z.any(),
  models: z
    .object({
      civitai_model_id: z.coerce.string(),
      cover_img: z.string(),
      id: z.string(),
      link: z.string(),
      name: z.string(),
      tags: z.string().array().optional(),
    })
    .array(),
})

export const importModels = internalAction(async (ctx) => {
  console.info(endpoint, 'importing models')

  const records = await fetchModelData()
  const parsedRecords = modelDataSchema.parse(records)

  const existingModels = await ctx.runQuery(api.db.models.listImageModels, { endpoint })

  for (const record of parsedRecords.models) {
    const architecture = record.name.includes('XL') ? 'SDXL' : 'SD'
    const shape = shapeImageModel({
      name: record.name,
      description: '',

      creatorName: '',
      link: record.link,
      license: '',
      tags: [],
      coverImageUrl: record.cover_img,

      architecture,
      sizes:
        architecture === 'SD'
          ? {
              portrait: [512, 768],
              landscape: [768, 512],
              square: [512, 512],
            }
          : {
              portrait: [832, 1216],
              landscape: [1216, 832],
              square: [1024, 1024],
            },

      endpoint: 'sinkin',
      modelId: record.id,
      endpointModelId: record.id,
      pricing: {
        type: 'perRequest',
        // * lazy estimate based of a 512px or 1024px square image at default settings
        value: architecture === 'SD' ? 0.00225 : 0.009,
      },
      moderated: false,
      available: true,
      hidden: false,
      internalScore: 0,
    })

    const existing = existingModels.find((m) => m.resourceKey === shape.resourceKey)
    if (existing) {
      await ctx.runMutation(internal.db.models.updateImageModel, {
        id: existing._id,
        ...shape,
      })
    } else {
      await ctx.runMutation(internal.db.models.createImageModel, shape)
      console.info(endpoint, 'created new model', shape.name, shape.resourceKey)
    }
  }
})
