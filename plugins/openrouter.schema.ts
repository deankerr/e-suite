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
}
