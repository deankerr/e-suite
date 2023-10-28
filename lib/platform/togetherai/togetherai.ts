import { createErrorResponse } from '@/lib/api'
import { env, logger, raise } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { z } from 'zod'
import type { paths } from './togetherai.api'

const log = logger.child({}, { msgPrefix: '[platform/togetherai] ' })

const { POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${env('TOGETHERAI_API_KEY')}`,
  },
})

export const togetherai = {
  async chat(input: object) {
    log.info('chat')
    const body = schemaTogetheraiChatRequest.parse(input)
    log.info(body, 'request body')
    const { data, error } = await POST('/inference', { body })

    if (data) {
      log.info(data, 'chat response')
      const choices = data.output?.choices
      if (choices) {
        const item = choices[0]?.text ?? '(e unhandled) no text'
        return new Response(item)
      }
      return createErrorResponse('(e error) unknown response')
    }

    if (error) {
      log.error(error, 'chat response')
      return createErrorResponse(error as string)
    }
  },
  async image(input: object) {
    // api spec is missing image parameters
    const { data, error } = await POST('/inference', { body: input })
    if (data) {
      const response = imageResponseSchema.parse(data)
      const base64 =
        response.output.choices[0]?.image_base64 ?? raise('response missing expected data')
      return { response, item: { base64 } }
    } else {
      console.error(error)
      throw new Error('Unknown togetherai error')
    }
  },
}

const schemaTogetheraiChatRequest = z.object({
  model: z.string(),
  prompt: z.string(),
  max_tokens: z.number(),
  stop: z.string().optional(), //# Chat ui uses string[]
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
