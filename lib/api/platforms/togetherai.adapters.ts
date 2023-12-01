import fs from 'node:fs'
import { convertMessagesToPromptFormat, createErrorResponse, handleChatError } from '@/lib/api/api'
import { EChatRequestSchema } from '@/lib/api/schemas'
import { _deprecated_env, raise } from '@/lib/utils'
import createClient from 'openapi-fetch'
import { z } from 'zod'
import { schemas } from '../schemas'
import type { paths } from './togetherai.api'

const { GET, POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${_deprecated_env('TOGETHERAI_API_KEY')}`,
  },
})

export const togetherai = {
  chat,
  getAvailableModels,
}

async function chat(chatRequest: EChatRequestSchema) {
  try {
    if (chatRequest.messages) {
      chatRequest.prompt = convertMessagesToPromptFormat(chatRequest.messages)
    }

    const body = schemas.togetherai.chat.input.parse(chatRequest)
    const { data, error } = await POST('/inference', { body })

    if (data) {
      const choices = data.output?.choices
      if (choices) {
        const item = choices[0]?.text ?? '(e unhandled) no text'
        return new Response(item)
      }
    }

    throw error ?? new Error('Unknown error')
  } catch (err) {
    return handleChatError(err)
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

export async function getAvailableModels() {
  console.log('fetching togetherai model list')
  const { data, error } = await GET('/models/info', {})
  console.log('data', data)
  if (error) console.error('openapi-fetch error', error)
  return data
}
