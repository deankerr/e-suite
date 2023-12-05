import z from 'zod'

export const falImageGenerationRequestSchema = z.object({
  model_name: z.string().default('runwayml/stable-diffusion-v1-5'),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
})

//* restricted supported fal functions
const functionIds = ['110602490-lora', '54285744-illusion-diffusion'] as const

//* fal will load any model from hugging face
const sdLoraModelIds = [
  'runwayml/stable-diffusion-v1-5',
  'stabilityai/stable-diffusion-xl-base-1.0',
] as const
const sdLoraLoraIds = [] as const

const getFunctionId = z.object({
  function_id: z.enum(functionIds),
})

const sdLoras = z.object({
  model_name: z.enum(sdLoraModelIds).default(sdLoraModelIds[0]),
  prompt: z.string().min(1),
  negative_prompt: z.string().optional(),
})

const illusionDiffusion = z.object({
  image_url: z.string().startsWith('data:image/'), //* enforce data urls
  prompt: z.string().min(1),
  negative_prompt: z.string().optional(),
})

export const falImageGenerationResponseSchema = z
  .object({
    images: z.array(
      z
        .object({
          url: z.string(),
          content_type: z.string(),
          file_name: z.string(),
          file_size: z.number(),
          width: z.number(),
          height: z.number(),
        })
        .passthrough(),
    ),
    seed: z.number(),
  })
  .passthrough()

const generationResponse = z
  .object({
    images: z.array(
      z
        .object({
          url: z.string(),
          content_type: z.string(),
          file_name: z.string(),
          file_size: z.number(),
          width: z.number(),
          height: z.number(),
        })
        .passthrough(),
    ),
    seed: z.number(),
  })
  .passthrough()

export const falSchema = {
  image: {
    generation: {
      getFunctionId,
      '54285744-illusion-diffusion': illusionDiffusion,
      '110602490-lora': sdLoras,
      response: generationResponse,
    },
  },
}
