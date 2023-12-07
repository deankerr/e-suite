import type { TextGenerationArgs } from '@huggingface/inference'
import z from 'zod'

export const huggingfaceSchema = {
  chat: {
    completions: {
      request: z.object({
        model: z.string(),
        inputs: z.string(),
        parameters: z.record(z.any()).optional(),
      }),
    },
  },
}
