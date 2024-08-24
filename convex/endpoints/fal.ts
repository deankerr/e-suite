import { v } from 'convex/values'
import * as vb from 'valibot'

import { internalMutation } from '../functions'
import { imageModelFields } from '../schema'
import FalModelsJson from './fal.models.json'

import type { Infer } from 'convex/values'

const imageModelSchema = v.object(imageModelFields)
export type ImageModelDataRecord = Infer<typeof imageModelSchema> & { resourceKey: string }

const sdxlSizes = {
  portrait: [832, 1216],
  landscape: [1216, 832],
  square: [1024, 1024],
} satisfies ImageModelDataRecord['sizes']

const importModelIds = [
  'fal-ai/flux-loras',
  'fal-ai/flux-general',
  'fal-ai/flux/dev',
  'fal-ai/flux/schnell',
  'fal-ai/flux-pro',
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
        modelId: data.model_id,
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
        pricing: {
          type: vb.parse(
            vb.picklist(['perRequest', 'perSecond', 'perMegapixel']),
            data.pricing?.type,
          ),
          value: vb.parse(vb.number(), Number(data.pricing?.value)),
        },

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

export const importImageModels = internalMutation({
  args: {
    replace: v.optional(v.boolean()),
  },
  handler: async (ctx, { replace = false }) => {
    const models = buildModelData()

    for (const model of models) {
      const existing = await ctx
        .table('image_models')
        .filter((q) => q.eq(q.field('endpointModelId'), model.endpointModelId))
        .unique()
      if (existing) {
        if (replace) await existing.replace(model)
      } else {
        await ctx.table('image_models').insert(model)
        console.log('new:', model.name)
      }
    }
  },
})

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
