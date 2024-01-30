import z from 'zod'

//* restricted supported models
const modelIds = [
  'stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
  'cjwbw/waifu-diffusion:25d2f75ecda0c0bed34c806b7b70319a53a1bccad3ade1a7496524f013f48983',
  'jbilcke/sdxl-botw:bf412da351d41547f117391eff2824ab0301b6ba1c6c010c4b5f766a492d62fc',
] as const

/* 
  very incomplete, models can have wildly varying inputs
  eg. waifu-diffusion accepts only 1024x768 or 768x1024
*/

const imageGenerationRequest = z.object({
  model: z.enum(modelIds),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
  height: z.number().max(1024).optional(),
  width: z.number().max(1024).optional(),
})

export const replicateSchema = {
  images: {
    generations: {
      request: imageGenerationRequest,
      response: z.string().url().array().min(1),
    },
  },
}
