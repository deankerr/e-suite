import { z } from 'zod'

export const togetheraiCreateChatSchema = z.object({
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
    finish_reason: z.string(),
    index: z.number(),
    text: z.string(),
  }),
)

const outputSchema = z.object({
  choices: choicesSchema,
  raw_compute_time: z.number(),
  result_type: z.string(),
})

export const togetheraiChatResponseSchema = z.object({
  status: z.string(),
  prompt: z.array(z.string()),
  model: z.string(),
  model_owner: z.string(),
  tags: z.record(z.any()),
  num_returns: z.number(),
  args: argsSchema,
  subjobs: z.array(z.any()),
  output: outputSchema,
})

//* Image
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
