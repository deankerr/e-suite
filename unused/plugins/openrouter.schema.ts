import z from 'zod'
import { openaiSchema } from './openai.schema'

export const openrouterSchema = {
  chat: {
    completions: {
      request: openaiSchema.chat.completions.request
        .merge(
          z.object({
            transforms: z.string().array().optional(),
          }),
        )
        .describe('openrouter chat request'),
    },
  },

  models: {
    list: z
      .object({
        id: z.string(),
        name: z.string(),
        pricing: z.object({
          prompt: z.coerce.string(), //* per 1 token
          completion: z.coerce.string(),
        }),
        context_length: z.number(),
        architecture: z.object({
          tokenizer: z.string(),
          instruct_type: z.string().nullable(),
        }),
        top_provider: z.object({
          max_completion_tokens: z.number().nullable(),
        }),
        per_request_limits: z.unknown(),
      })
      .array(),
  },
}
