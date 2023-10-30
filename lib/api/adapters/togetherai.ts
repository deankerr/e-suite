import { convertMessagesToPromptFormat, createErrorResponse } from '@/lib/api/api'
import { EChatRequestSchema } from '@/lib/api/schema'
import { env, logger, raise } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { z } from 'zod'
import { schemas } from '../schemas'
import type { paths } from './togetherai.api'

const log = logger.child({}, { msgPrefix: '[platform/togetherai] ' })

const { GET, POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${env('TOGETHERAI_API_KEY')}`,
  },
})

export const togetherai = {
  chat,
}

async function chat(chatRequest: EChatRequestSchema) {
  log.info('chat')
  if (chatRequest.messages) {
    chatRequest.prompt = convertMessagesToPromptFormat(chatRequest.messages)
  }

  const body = schemas.togetherai.chat.input.parse(chatRequest)
  console.log('request body', body)
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
}

async function image(input: object) {
  // api spec is missing image parameters
  const { data, error } = await POST('/inference', { body: input })
  if (data) {
    const response = schemas.togetherai.image.output.parse(data)
    const base64 =
      response.output.choices[0]?.image_base64 ?? raise('response missing expected data')
    return { response, item: { base64 } }
  } else {
    console.error(error)
    throw new Error('Unknown togetherai error')
  }
}

export async function models() {
  const { data, error } = await GET('/models/info?options=', {})
  log.info(data, 'models data')
  log.info(error, 'models error')

  /* 
  hidden_keys = [
            "_id",
            "modelInstanceConfig",
            "created_at",
            "update_at",
            "pricing",
            "show_in_playground",
            "access",
            "pricing_tier",
            "hardware_label",
            "depth",
            "descriptionLink",
        ]
  */
}
