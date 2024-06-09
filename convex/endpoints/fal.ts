import { internalMutation } from '../functions'

export const importModels = internalMutation(async (ctx) => {
  for (const model of falImageModelData) {
    await ctx.table('image_models').insert({
      ...model,
    })
  }
})

export const falImageModelData = [
  {
    slug: 'fal-ai/hyper-sdxl',
    name: 'Hyper SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'sdxl' as const,
    sizes: {
      portrait: [832, 1216],
      landscape: [1216, 832],
      square: [1024, 1024],
    },

    endpoints: [
      {
        endpoint: 'fal',
        model: 'fal-ai/hyper-sdxl',
        pricing: {},
      },
    ],
  },
  {
    slug: 'fal-ai/fast-lightning-sdxl',
    name: 'Fast Lightning SDXL',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'sdxl' as const,
    sizes: {
      portrait: [832, 1216],
      landscape: [1216, 832],
      square: [1024, 1024],
    },

    endpoints: [
      {
        endpoint: 'fal',
        model: 'fal-ai/fast-lightning-sdxl',
        pricing: {},
      },
    ],
  },
  {
    slug: 'fal-ai/pixart-sigma',
    name: 'Pixart Sigma',
    description: '',

    creatorName: '',
    link: '',
    license: '',
    tags: [],

    architecture: 'sdxl' as const,
    sizes: {
      portrait: [832, 1216],
      landscape: [1216, 832],
      square: [1024, 1024],
    },

    endpoints: [
      {
        endpoint: 'fal',
        model: 'fal-ai/pixart-sigma',
        pricing: {},
      },
    ],
  },
]
