import type { ImageModelDataRecord } from '../db/endpoints'

const sdxlSizes = {
  portrait: [832, 1216],
  landscape: [1216, 832],
  square: [1024, 1024],
} satisfies ImageModelDataRecord['sizes']

export const falImageModelData = [
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
