import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { env } from '../shared/utils'

import type { ActionCtx } from '../_generated/server'
import type { ImageModelDataRecord } from '../db/endpoints'
import type { MutationCtx, TextToImageConfig, TextToImageHandlerResult } from '../types'

const api = ky.extend({
  prefixUrl: 'https://sinkin.ai/m',
  timeout: 1000 * 60,
  retry: 0,
})

export const textToImage = async ({
  textToImageConfig,
}: {
  textToImageConfig: TextToImageConfig
}): Promise<TextToImageHandlerResult> => {
  const { endpointModelId, prompt, width, height, n } = textToImageConfig
  const body = new URLSearchParams()
  body.set('model_id', endpointModelId)
  body.set('prompt', prompt)
  body.set('width', String(width))
  body.set('height', String(height))
  body.set('num_images', String(n))
  body.set('access_token', env('SINKIN_API_KEY'))

  console.log('[textToImage] [input] [sinkin]', body)
  const response = await api
    .post('inference', {
      body,
    })
    .json()
  console.log('[textToImage] [output] [sinkin]', response)

  const result = textToImageResponseSchema.safeParse(response)
  if (!result.success) {
    return {
      error: {
        message: `failed to parse response: ${JSON.stringify(result.error.issues)}`,
        code: 'invalid_response',
        fatal: true,
      },
      images: undefined,
    }
  }

  if ('images' in result.data) {
    // # success
    const { images } = result.data
    return {
      images: images.map((image) => ({ url: image })),
      error: undefined,
    }
  }

  // # content rejection error
  if (result.data.error_code === 41) {
    return {
      error: {
        message: result.data.message,
        code: 'endpoint_refused',
        fatal: true,
      },
      images: undefined,
    }
  }

  // # other errors
  return {
    error: {
      message: result.data.message,
      code: 'endpoint_error',
      fatal: true,
    },
    images: undefined,
  }
}

const textToImageResponseSchema = z.union([
  z.object({
    inf_id: z.string(),
    credit_cost: z.number(),
    error_code: z.number(),
    images: z.string().array(),
  }),
  z.object({
    error_code: z.number(),
    message: z.string(),
  }),
])

export const fetchModelData = async (ctx: ActionCtx) => {
  console.log('https://sinkin.ai/api/models')
  const body = new FormData()
  body.append('access_token', env('SINKIN_API_KEY'))
  const response = await ky.post('https://sinkin.ai/api/models', { body }).json()
  await ctx.runMutation(internal.db.endpoints.cacheEndpointModelData, {
    endpoint: 'sinkin',
    name: 'image-models',
    data: JSON.stringify(response, null, 2),
  })
}

export const getNormalizedModelData = async (ctx: MutationCtx) => {
  const cached = await ctx
    .table('endpoint_data_cache')
    .order('desc')
    .filter((q) =>
      q.and(q.eq(q.field('endpoint'), 'sinkin'), q.eq(q.field('name'), 'image-models')),
    )
    .firstX()

  const modelList = modelDataSchema.parse(JSON.parse(cached.data))
  return modelList.models.map((d): ImageModelDataRecord => {
    const architecture = d.name.includes('XL') ? 'SDXL' : 'SD'

    return {
      resourceKey: `sinkin::${encodeURIComponent(d.name)}`,
      name: d.name,
      description: '',

      creatorName: '',
      link: d.link,
      license: '',
      tags: [],
      coverImageUrl: d.cover_img,

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
      endpointModelId: d.id,
      pricing: {},
      moderated: false,
      available: true,
      hidden: false,
      internalScore: 0,
    }
  })
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
