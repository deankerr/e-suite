import type { ImageModelDataRecord } from '../db/endpoints'

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
