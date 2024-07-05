import * as client from '@fal-ai/serverless-client'
import { z } from 'zod'

import type { ImageModelDataRecord } from '../db/endpoints'
import type { TextToImageConfig, TextToImageHandlerResult } from '../types'

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

export const falImageModelData = [
  {
    resourceKey: 'fal::fal-ai/stable-diffusion-v3-medium',
    name: 'Stable Diffusion V3 Medium',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SD3' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    endpointModelId: 'fal-ai/stable-diffusion-v3-medium',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
  {
    resourceKey: 'fal::fal-ai/hyper-sdxl',
    name: 'Hyper SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    endpointModelId: 'fal-ai/hyper-sdxl',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
  {
    resourceKey: 'fal::fal-ai/fast-lightning-sdxl',
    name: 'Fast Lightning SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    endpointModelId: 'fal-ai/fast-lightning-sdxl',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
  {
    resourceKey: 'fal::fal-ai/pixart-sigma',
    name: 'PixArt-Σ',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    endpointModelId: 'fal-ai/pixart-sigma',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
]

export const getNormalizedModelData = (): ImageModelDataRecord[] => {
  return falImageModelData.map((data) => ({
    ...data,
    internalScore: 0,
  }))
}

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
