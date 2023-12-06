import { messageSchema } from '@/schema/message'
import z from 'zod'

const categoriesSchema = z.object({
  sexual: z.boolean(),
  hate: z.boolean(),
  harassment: z.boolean(),
  'self-harm': z.boolean(),
  'sexual/minors': z.boolean(),
  'hate/threatening': z.boolean(),
  'violence/graphic': z.boolean(),
  'self-harm/intent': z.boolean(),
  'self-harm/instructions': z.boolean(),
  'harassment/threatening': z.boolean(),
  violence: z.boolean(),
})

const categoryScoresSchema = z.object({
  sexual: z.number(),
  hate: z.number(),
  harassment: z.number(),
  'self-harm': z.number(),
  'sexual/minors': z.number(),
  'hate/threatening': z.number(),
  'violence/graphic': z.number(),
  'self-harm/intent': z.number(),
  'self-harm/instructions': z.number(),
  'harassment/threatening': z.number(),
  violence: z.number(),
})

const resultSchema = z.object({
  flagged: z.boolean(),
  categories: categoriesSchema,
  category_scores: categoryScoresSchema,
})

export const openaiSchema = {
  chat: {
    //* chat
    completions: {
      request: z
        .object({
          model: z.string(),
          messages: messageSchema.array(),
          stream: z.boolean().optional(),

          frequency_penalty: z.number().min(-2).max(2).step(0.01).optional(),
          max_tokens: z.number().min(1).step(1).optional(), //? max per model?
          presence_penalty: z.number().min(-2).max(2).step(0.01).optional(),
          stop: z.string().array().min(0).max(4).optional(),
          temperature: z.number().min(0).max(2).step(0.01).optional(),
          top_p: z.number().min(0).max(2).step(0.01).optional(),
        })
        .describe('openai chat request'),

      //^ response is typed
    },
  },

  //* image
  image: {
    generations: {
      request: z
        .object({
          prompt: z.string(),
          model: z.string().optional(),
          n: z.number().nullish(),
          quality: z.enum(['standard', 'hd']).optional(),
          response_format: z.enum(['url', 'b64_json']).nullish(),
          size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).nullish(),
          style: z.enum(['vivid', 'natural']).nullish(),
        })
        .describe('openai image generation request'),

      response: z
        .object({
          created: z.number(),
          data: z.array(
            z.union([
              z.object({
                url: z.string(),
                revised_prompt: z.string().optional(),
              }),

              z.object({
                b64_json: z.string(),
                revised_prompt: z.string().optional(),
              }),
            ]),
          ),
        })
        .describe('openai image generation response'),
    },
  },

  moderations: {
    request: z
      .object({
        input: z.string().or(z.string().array()),
        model: z.optional(z.enum(['text-moderation-stable', 'text-moderation-latest'])),
      })
      .describe('openai moderations request'),

    response: z
      .object({
        id: z.string(),
        model: z.string(),
        results: z.array(resultSchema),
      })
      .describe('openai moderations response'),
  },
}
