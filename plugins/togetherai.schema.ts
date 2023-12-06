import { z } from 'zod'

export const togetheraiSchema = {
  //* Chat
  chat: {
    completions: {
      request: z
        .object({
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
        .describe('togetherai chat completion request'),

      response: z
        .object({
          status: z.string(),
          prompt: z.array(z.string()),
          model: z.string(),
          model_owner: z.string().optional(),
          num_returns: z.number(),
          output: z.object({
            choices: z.array(
              z.object({
                finish_reason: z.string().optional(),
                index: z.number().optional(),
                text: z.string(),
              }),
            ),
            raw_compute_time: z.number().optional(),
            result_type: z.string(),
          }),
        })
        .passthrough()
        .describe('togetherai chat completion response'),
    },
  },

  //* Image
  images: {
    generations: {
      request: z
        .object({
          prompt: z.string(),
          model: z.string(),
          negative_prompt: z.string().optional(),
          seed: z.number().optional(),
          results: z.number().optional(),
          height: z.number().optional(),
          width: z.number().optional(),
        })
        .describe('togetherai image generation request'),

      response: z
        .object({
          status: z.string(),
          prompt: z.string().array(),
          model: z.string(),
          model_owner: z.string(),
          num_returns: z.number(),
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
        .passthrough()
        .describe('togetherai image generation response'),
    },
  },
}
