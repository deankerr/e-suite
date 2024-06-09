import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { env, insist } from '../shared/utils'

export const fetchModels = internalAction(async (ctx) => {
  console.log('https://sinkin.ai/api/models')
  const body = new FormData()
  body.append('access_token', env('SINKIN_API_KEY'))
  const response = await ky.post('https://sinkin.ai/api/models', { body }).json()
  await ctx.runMutation(internal.endpoints.createCacheData, {
    endpoint: 'sinkin',
    name: 'image-models',
    data: JSON.stringify(response, null, 2),
  })
})

export const importModels = internalMutation(async (ctx) => {
  const data = await ctx
    .table('endpoint_data_cache')
    .order('desc')
    .filter((q) =>
      q.and(q.eq(q.field('endpoint'), 'sinkin'), q.eq(q.field('name'), 'image-models')),
    )
    .first()
  insist(data, 'no image-models data')
  const { models } = modelDataSchema.parse(JSON.parse(data.data))

  for (const model of models) {
    const architecture = model.name.includes('XL') ? 'sdxl' : 'sd'
    await ctx.table('image_models').insert({
      slug: model.name,
      link: model.link,
      name: model.name,
      description: '',
      creatorName: '',
      license: '',
      tags: [],
      endpoints: [
        {
          endpoint: 'sinkin',
          model: model.id,
          pricing: {},
        },
      ],
      architecture,
      sizes:
        architecture === 'sd'
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
    })
  }
})

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
