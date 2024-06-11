import type { ImageModelDataRecord } from '../db/models'

const sdxlSizes = {
  portrait: [832, 1216],
  landscape: [1216, 832],
  square: [1024, 1024],
} satisfies ImageModelDataRecord['sizes']

export const falImageModelData = [
  {
    slug: 'fal-ai/hyper-sdxl',
    name: 'Hyper SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    model: 'fal-ai/hyper-sdxl',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
  {
    slug: 'fal-ai/fast-lightning-sdxl',
    name: 'Fast Lightning SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    model: 'fal-ai/fast-lightning-sdxl',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
  {
    slug: 'fal-ai/pixart-sigma',
    name: 'PixArt-Σ',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'SDXL' as const,
    sizes: sdxlSizes,

    endpoint: 'fal',
    model: 'fal-ai/pixart-sigma',
    pricing: {},
    moderated: false,
    available: true,
    hidden: false,
  },
]

export const getNormalizedModelData = (): ImageModelDataRecord[] => {
  return falImageModelData
}
