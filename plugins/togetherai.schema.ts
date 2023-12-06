import { z } from 'zod'

export const togetheraiCreateChatSchema = z.object({
  model: z.string(),
  // prompt: z.string(),
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

//* Chat Response
const argsSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  temperature: z.number(),
  top_p: z.number(),
  top_k: z.number(),
  max_tokens: z.number(),
})

const choicesSchema = z.array(
  z.object({
    finish_reason: z.string().optional(),
    index: z.number().optional(),
    text: z.string(),
  }),
)

const outputSchema = z.object({
  choices: choicesSchema,
  raw_compute_time: z.number().optional(),
  result_type: z.string(),
})

export const togetheraiChatResponseSchema = z.object({
  status: z.string(),
  prompt: z.array(z.string()),
  model: z.string(),
  model_owner: z.string().optional(),
  tags: z.record(z.any()).optional(),
  num_returns: z.number(),
  args: argsSchema.partial(),
  subjobs: z.array(z.any()).optional(),
  output: outputSchema,
})

//* Image
const imageRequest = z
  .object({
    prompt: z.string(),
    model: z.string(),
    negative_prompt: z.string().optional(),
    seed: z.number().optional(),
    results: z.number().optional(),
    height: z.number().optional(),
    width: z.number().optional(),
  })
  .describe('togetherai image generation request')

const imageResponse = z
  .object({
    status: z.string(),
    prompt: z.string().array(),
    model: z.string(),
    model_owner: z.string(),
    num_returns: z.number(),
    args: z.object({}).passthrough(),
    output: z.object({
      choices: z
        .array(
          z.object({
            image_base64: z.string(),
          }),
        )
        .min(1),
      result_type: z.string(),
    }),
  })
  .describe('togetherai image generation response')

export const togetheraiSchema = {
  image: {
    generations: {
      request: imageRequest,
      response: imageResponse,
    },
  },
}
