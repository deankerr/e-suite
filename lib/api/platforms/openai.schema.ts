import { z } from 'zod'

export const schemaOpenAIChatRequest = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system', 'function']),
      name: z.string().optional(),
      content: z.string(),
    }),
  ),
  stream: z.boolean().optional(),

  frequency_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  // function_call: z.unknown().optional(),
  // functions: z.unknown().optional(),
  // logit_bias: z.union([z.record(z.number()), z.null()]).optional(),
  max_tokens: z.number().min(1).step(1).optional(), //? max per model?
  // n: z.number().optional(),
  presence_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  stop: z.string().array().min(0).max(4).optional(),
  temperature: z.number().min(0).max(2).step(0.01).optional(),
  top_p: z.number().min(0).max(2).step(0.01).optional(),
  // user: z.string().optional(),
})
export type OpenAIInferenceParameters = z.infer<typeof schemaOpenAIChatRequest>

export const openai = {
  chat: {
    input: schemaOpenAIChatRequest,
  },
}
