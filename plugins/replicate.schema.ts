import z from 'zod'

//* restricted supported models
const modelIds = [
  'cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983',
  'jbilcke/sdxl-botw:bf412da351d41547f117391eff2824ab0301b6ba1c6c010c4b5f766a492d62fc',
] as const

const imageGenerationRequest = z.object({
  prompt: z.string(),
  model: z.enum(modelIds),
})

const imageGenerationResponse = z.string().url().array().min(1)

export const replicateSchema = {
  image: {
    generations: {
      request: imageGenerationRequest,
      response: imageGenerationResponse,
    },
  },
}
