import * as client from '@fal-ai/serverless-client'
import { z } from 'zod'

import { internalMutation } from '../functions'
import FalModelsJson from './fal.models.json'

import type { ImageModelDataRecord } from '../db/endpoints'
import type { RunConfigTextToImage, TextToImageConfig, TextToImageHandlerResult } from '../types'

client.config({
  credentials: process.env.FAL_API_KEY!,
})

export const textToImage = async ({
  textToImageConfig,
}: {
  textToImageConfig: TextToImageConfig
}): Promise<TextToImageHandlerResult> => {
  try {
    const { endpointModelId, prompt } = textToImageConfig

    const input = {
      prompt,
      image_size: {
        width: textToImageConfig.width,
        height: textToImageConfig.height,
      },
      num_images: textToImageConfig.n,

      prompt_expansion: false,
      expand_prompt: false,
      enable_safety_checker: false,
    }

    console.log('[textToImage] [input] [fal]', endpointModelId, input)
    const response = await client.subscribe(endpointModelId, {
      input,
    })
    console.log('[textToImage] [output] [fal]', response)

    const { images } = z
      .object({
        images: z
          .object({
            url: z.string(),
          })
          .array(),
      })
      .parse(response)

    return { images, error: undefined }
  } catch (err) {
    console.error(err)

    if (err instanceof client.ValidationError) {
      return {
        error: {
          code: 'endpoint_error',
          message: `${err.name}: ${JSON.stringify(err.body.detail)}`,
          status: err.status,
          fatal: true,
        },
        images: undefined,
      }
    }

    if (err instanceof client.ApiError) {
      return {
        error: {
          code: 'endpoint_error',
          message: `${err.name}: ${err.body?.detail}`,
          status: err.status,
          fatal: true,
        },
        images: undefined,
      }
    }

    if (err instanceof Error) {
      return {
        error: {
          code: 'unhandled',
          message: err.message,
          fatal: true,
        },
        images: undefined,
      }
    }

    throw err
  }
}

export const textToImageWf = async (args: RunConfigTextToImage) => {
  try {
    const { resourceKey, width, height, size, prompt, n } = args
    const modelId = z
      .string()
      .startsWith('fal::')
      .transform((s) => s.split('::')[1])
      .parse(resourceKey)

    const input = {
      prompt,
      image_size: width && height ? { width, height } : size,
      num_images: n,

      prompt_expansion: false,
      expand_prompt: false,
      enable_safety_checker: false,
    }
    console.log('[textToImage] [fal] [input]', modelId, input)

    const response = await client.subscribe(modelId, {
      input,
    })
    console.log('[textToImage] [fal] [output]', response)

    const { images } = z
      .object({
        images: z
          .object({
            url: z.string(),
          })
          .array(),
      })
      .parse(response)

    return { imageUrls: images.map((i) => i.url) }
  } catch (err) {
    console.error(err)

    // if (err instanceof client.ValidationError) {
    //   return {
    //     error: {
    //       code: 'endpoint_error',
    //       message: `${err.name}: ${JSON.stringify(err.body.detail)}`,
    //       status: err.status,
    //       fatal: true,
    //     },
    //     images: undefined,
    //   }
    // }

    // if (err instanceof client.ApiError) {
    //   return {
    //     error: {
    //       code: 'endpoint_error',
    //       message: `${err.name}: ${err.body?.detail}`,
    //       status: err.status,
    //       fatal: true,
    //     },
    //     images: undefined,
    //   }
    // }

    // if (err instanceof Error) {
    //   return {
    //     error: {
    //       code: 'unhandled',
    //       message: err.message,
    //       fatal: true,
    //     },
    //     images: undefined,
    //   }
    // }

    throw err
  }
}

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
