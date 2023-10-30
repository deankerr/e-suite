import { EChatRequestSchema } from '@/lib/api/schema'
import { env, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { schemaOpenAIChatRequest } from './openai'

const api = new OpenAI({
  apiKey: env('OPENROUTER_API_KEY'),
  baseURL: 'https://openrouter.ai/api/v1/',
  defaultHeaders: {
    'HTTP-Referer': env('SITE_URL', 'https://esuite.devel'),
  },
})

const schemaOpenRouterChatRequest = schemaOpenAIChatRequest

export const openrouter = {
  label: 'OpenRouter',
  chat: {
    run: chat,
    schema: {
      input: schemaOpenRouterChatRequest,
    },
  },
}

async function chat(chatRequest: EChatRequestSchema) {
  const body = schemaOpenAIChatRequest.parse(chatRequest)
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
}
