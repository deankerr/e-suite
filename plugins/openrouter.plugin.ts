import 'server-only'
import { ENV } from '@/lib/env'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openrouterCreateChatSchema } from './openrouter.schema'

const api = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': ENV.APP_SITE_URL,
  },
})

export const openrouterPlugin = {
  chat: async (input: unknown) => {
    const body = openrouterCreateChatSchema.parse(input)

    //* streaming response
    if (body.stream) {
      const response = await api.chat.completions.create(
        body as OpenAI.ChatCompletionCreateParamsStreaming,
      )
      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    }

    //* json response
    const response = await api.chat.completions.create(
      body as OpenAI.ChatCompletionCreateParamsNonStreaming,
    )

    return Response.json(response)
  },
}

export async function getAvailableModels() {
  console.log('fetching openrouter model list')
  const response = await fetch('https://openrouter.ai/api/v1/models')
  const json = await response.json()
  return json.data
}
