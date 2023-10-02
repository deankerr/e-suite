import { raise } from '@/lib/utils'
import OpenAI from 'openai'

const api = new OpenAI()

export const openai = {
  async chat(input: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming) {
    const response = await api.chat.completions.create(input)
    const item = response.choices[0]?.message.content ?? raise('response missing expected data')
    return { response, item }
  },
}
