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

  models: {
    list: z
      .object({
        modelInstanceConfig: z.unknown(),
        _id: z.string(),
        name: z.string(),
        display_name: z.string(),
        display_type: z.string().optional(),
        description: z.string(),
        license: z.string(),
        creator_organization: z.string(),
        pricing_tier: z.string().optional(),
        num_parameters: z.coerce.number().optional(),
        release_date: z.string().optional(),
        context_length: z.number().optional(),
        config: z.record(z.any()).optional(),
        max_tokens: z.number().optional(),
        pricing: z.object({
          input: z.number(),
          output: z.number(),
        }),
        link: z.string().optional(),
        // hardware_label: z.string().optional(),
        // access: z.string().optional(),
        // show_in_playground: z.coerce.boolean().optional(),
        // finetuning_supported: z.boolean().optional(),
        // isFeaturedModel: z.boolean().optional(),
        // external_pricing_url: z.string().optional(),
        // created_at: z.string().optional(),
        // update_at: z.string().optional(),
        // autopilot_pool: z.unknown().optional(),
        // instances: z.unknown().optional(),
        // descriptionLink: z.string().optional(),
        // depth: z.unknown().optional(),
      })
      .array(),
  },
}
