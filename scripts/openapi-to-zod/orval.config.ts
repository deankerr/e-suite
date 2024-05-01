import { defineConfig } from 'orval'

const models = [
  'fal-ai/hyper-sdxl',
  'fal-ai/fast-lightning-sdxl',
  'fal-ai/pixart-sigma',
  'fal-ai/imageutils',
  'fal-ai/lora',
  'fal-ai/fast-animatediff',
  'fal-ai/illusion-diffusion',
]

const inputOpts = {
  target: '',
}

const outputOpts = {
  workspace: '../../convex/providers',
  schemas: './types',
  indexFiles: false,

  client: 'zod',
  mode: 'single',
  prettier: true,
  target: '',
}

const getInputUrl = (model: string) => `https://fal.ai/api/apps/${model}/openapi.json`

const getOutputPath = (model: string) => `./${model}.ts`

const config = models.map((model) => [
  model,
  {
    input: {
      ...inputOpts,
      target: getInputUrl(model),
    },
    output: {
      ...outputOpts,
      target: getOutputPath(model),
    },
  },
])

export default defineConfig(Object.fromEntries(config))
