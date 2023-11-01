import { z } from 'zod'

export const schemaTogetheraiChatRequest = z.object({
  model: z.string(),
  prompt: z.string(),
  max_tokens: z.number().default(1024), //! workaround default
  stop_token: z
    .string()
    .or(z.string().array())
    .optional()
    .transform((val) => (Array.isArray(val) ? val[0] : val)),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
  logprobs: z.number().optional(),
  stream_tokens: z.boolean().optional(),
})

const imageResponseSchema = z.object({
  status: z.string(),
  prompt: z.string().array(),
  model: z.string(),
  model_owner: z.string(),
  tags: z.object({}).passthrough(), // ?
  num_returns: z.number(),
  args: z.object({}).passthrough(), // ? request params
  subjobs: z.unknown().array(), // ?
  output: z.object({
    choices: z.array(
      z.object({
        image_base64: z.string(),
      }),
    ),
    result_type: z.string(),
  }),
})

export const togetherai = {
  chat: {
    input: schemaTogetheraiChatRequest,
  },
  image: {
    output: imageResponseSchema,
  },
}
