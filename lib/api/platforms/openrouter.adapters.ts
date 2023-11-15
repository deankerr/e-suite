import { EChatRequestSchema } from '@/lib/api/schemas'
import { env, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { handleChatError } from '../api'
import { schemas } from '../schemas'

const api = new OpenAI({
  apiKey: env('OPENROUTER_API_KEY'),
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': env('SITE_URL', 'https://esuite.devel'),
  },
})

export const openrouter = {
  chat,
  getAvailableModels,
}

async function chat(chatRequest: EChatRequestSchema) {
  try {
    const body = schemas.openrouter.chat.input.parse(chatRequest)
    if (body.stream) {
      const response = await api.chat.completions.create(
        body as OpenAI.Chat.ChatCompletionCreateParamsStreaming,
      )
      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    } else {
      const response = await api.chat.completions.create(
        body as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
      )
      const item = response.choices[0]?.message.content ?? raise('response missing expected data')
      return new Response(item)
    }
  } catch (err) {
    return handleChatError(err)
  }
}

export async function getAvailableModels() {
  console.log('fetching openrouter model list')
  const response = await fetch('https://openrouter.ai/api/v1/models')
  const json = await response.json()
  return json.data
}
