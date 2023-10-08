import { env, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const api = new OpenAI({
  apiKey: env('OPENROUTER_API_KEY'),
  baseURL: 'https://openrouter.ai/api/v1/',
  defaultHeaders: {
    'HTTP-Referer': env('SITE_URL', 'https://pabel.devel'),
  },
})

export const openrouter = {
  async chat(input: OpenAI.Chat.ChatCompletionCreateParams) {
    if (input.stream) {
      const response = await api.chat.completions.create(input)
      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    } else {
      const response = await api.chat.completions.create(input)
      const item = response.choices[0]?.message.content ?? raise('response missing expected data')
      return new Response(item)
    }
  },
}
