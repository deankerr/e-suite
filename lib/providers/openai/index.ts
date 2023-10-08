import { createErrorResponse, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const api = new OpenAI()

export const openai = {
  chat,
  chatModerated,
  image,
}

async function chat(input: OpenAI.Chat.ChatCompletionCreateParams) {
  console.log('openai.chat')
  if (input.stream) {
    const response = await api.chat.completions.create(input)
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } else {
    const response = await api.chat.completions.create(input)
    const item = response.choices[0]?.message.content ?? raise('response missing expected data')
    return new Response(item)
  }
}

async function chatModerated(input: OpenAI.Chat.ChatCompletionCreateParams) {
  console.log('openai.chatModerated')
  const messages = input.messages.map((m) => `${m.content}`)
  const response = await api.moderations.create({ input: messages })
  const flagged = input.messages.filter((_, i) => response.results[i]?.flagged)

  if (flagged.length === 0) {
    console.log('allow chat')
    return chat(input)
  } else {
    console.log(flagged)
    console.log('reject chat')
    return Response.json(createErrorResponse({ message: 'Moderation failed' }))
  }
}

async function image(input: OpenAI.ImageGenerateParams) {
  console.log('openai.image')
  try {
    const response = await api.images.generate(input)
    const item = { url: response.data[0]?.url ?? raise('response missing expected url') }
    return { response, item }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { status, message } = error
      return createErrorResponse({ status, message })
    } else {
      throw error
    }
  }
}
