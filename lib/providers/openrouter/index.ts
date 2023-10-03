import { env, raise } from '@/lib/utils'
import OpenAI from 'openai'

const api = new OpenAI({
  apiKey: env('OPENROUTER_API_KEY'),
  baseURL: 'https://openrouter.ai/api/v1/',
  defaultHeaders: {
    'HTTP-Referer': env('SITE_URL', 'https://pabel.devel'),
  },
})

export const openrouter = {
  async chat(input: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming) {
    const response = await api.chat.completions.create(input)
    const item = response.choices[0]?.message.content ?? raise('response missing expected data')
    return { response, item }
  },
}
