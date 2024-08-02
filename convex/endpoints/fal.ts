import * as client from '@fal-ai/serverless-client'
import { v } from 'convex/values'

import { internalMutation } from '../functions'
import { imageModelFields } from '../schema'
import FalModelsJson from './fal.models.json'

import type { Infer } from 'convex/values'

const imageModelSchema = v.object(imageModelFields)
export type ImageModelDataRecord = Infer<typeof imageModelSchema> & { resourceKey: string }

export const createFalClient = () => {
  client.config({
    credentials: process.env.FAL_API_KEY!,
  })

  return client
}

const sdxlSizes = {
  portrait: [832, 1216],
  landscape: [1216, 832],
  square: [1024, 1024],
} satisfies ImageModelDataRecord['sizes']

export const visionModels = [
  'fal-ai/llavav15-13b',
  'fal-ai/llava-next',
  // 'fal-ai/moondream/batched',
  'fal-ai/idefics-2-8b',
  'fal-ai/internlm-xcomposer-2-7b',
  'fal-ai/llava-phi-3-mini',
  // 'fal-ai/mantis-llava-7b-v11',
  'fal-ai/qwen-vl-chat-7b-int4',
  'fal-ai/llava-llama3-8b-v11',
]

const importModelIds = [
  'fal-ai/aura-flow',
  'fal-ai/stable-diffusion-v3-medium',
  'fal-ai/pixart-sigma',
  'fal-ai/hyper-sdxl',
  'fal-ai/fast-lightning-sdxl',
]

function buildModelData(): ImageModelDataRecord[] {
  const models = FalModelsJson.filter((model) => importModelIds.includes(model.model_id)).map(
    (data, i) => {
      const record: ImageModelDataRecord = {
        resourceKey: `fal::${data.model_id}`,
        endpoint: 'fal',
        endpointModelId: data.model_id,
        name: data.name,
        description: data.description,
        creatorName: data.creatorName ?? '',
        link: data.link,
        license: '',
        tags: [],
        coverImageUrl: data.cover_image,
        architecture: data.model_id.includes('sdxl')
          ? 'SDXL'
          : data.model_id.includes('v3-medium')
            ? 'SD3'
            : '',
        sizes: sdxlSizes,
        pricing: data.pricing
          ? {
              type: data.pricing.type,
              value: Number(data.pricing.value),
            }
          : { type: 'unknown' },
        moderated: false,
        available: true,
        hidden: false,
        internalScore: 10 - i,
      }

      return record
    },
  )

  return models
}

export const importFalModelRecords = internalMutation({
  args: {},
  handler: async (ctx) => {
    const models = buildModelData()

    for (const model of models) {
      const existing = await ctx
        .table('image_models')
        .filter((q) => q.eq(q.field('endpointModelId'), model.endpointModelId))
        .unique()
      if (existing) {
        await existing.replace(model)
        console.log('updated:', model.name)
      } else {
        await ctx.table('image_models').insert(model)
        console.log('new:', model.name)
      }
    }
  },
})
