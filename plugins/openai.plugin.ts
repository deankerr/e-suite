import { ENV } from '@/lib/env'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openaiCreateChatSchema } from './openai.schema'

const api = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
})
const textOnly = true

export const openaiPlugin = {
  chat: async (input: unknown) => {
    const body = openaiCreateChatSchema.parse(input)

    if (body.stream) {
      const response = await api.chat.completions.create(
        body as OpenAI.ChatCompletionCreateParamsStreaming,
      )
      const stream = OpenAIStream(response)
      return new StreamingTextResponse(stream)
    }

    const response = await api.chat.completions.create(
      body as OpenAI.ChatCompletionCreateParamsNonStreaming,
    )

    if (textOnly) return new Response(response.choices[0]?.message.content)
    return Response.json(response)
  },
}
