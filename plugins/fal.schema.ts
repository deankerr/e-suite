import z from 'zod'

export const falImageGenerationRequestSchema = z.object({
  model_name: z.string().default('runwayml/stable-diffusion-v1-5'),
  prompt: z.string(),
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
