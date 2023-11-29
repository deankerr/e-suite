import { createErrorResponse, handleChatError } from '@/lib/api/api'
import { EChatRequestSchema } from '@/lib/api/schemas'
import { raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { schemas } from '../schemas'

export const openai = {
  chat: chatModerated,
  getAvailableModels,
}

const api = new OpenAI()

async function chat(chatRequest: EChatRequestSchema) {
  try {
    const body = schemas.openai.chat.input.parse(chatRequest)
    if (body.stream === true) {
      console.log('streaming')
      const response = await api.chat.completions.create(
        body as OpenAI.Chat.ChatCompletionCreateParamsStreaming,
      )
      const stream = OpenAIStream(response)
      console.log('streaming to client')
      return new StreamingTextResponse(stream)
    } else {
      console.log('non-streaming')
      const response = await api.chat.completions.create(
        body as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
      )

      const item = response.choices[0]?.message.content ?? raise('response missing expected data')
      console.log('sending to client')
      return new Response(item)
    }
  } catch (err) {
    return handleChatError(err)
  }
}

async function chatModerated(chatRequest: EChatRequestSchema) {
  try {
    console.log('request moderation')
    const body = schemas.openai.chat.input.parse(chatRequest)
    const messages = body.messages.map((m) => `${m.content}`)
    const response = await api.moderations.create({ input: messages })
    const flagged = body.messages.filter((_, i) => response.results[i]?.flagged)

    if (flagged.length === 0) {
      console.log('allow')
      return chat(chatRequest)
    } else {
      console.warn(flagged, 'reject')
      const message = `OpenAI Moderation rejected: ${flagged
        .map((m) => `"${m.content}"`)
        .join(', ')}`
      return createErrorResponse(message, 403)
    }
  } catch (err) {
    return handleChatError(err)
  }
}

async function image(input: OpenAI.ImageGenerateParams) {
  try {
    const response = await api.images.generate(input)
    const item = { url: response.data[0]?.url ?? raise('response missing expected url') }
    console.log(item, 'image')
    return { response, item }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { status, message } = error
      return createErrorResponse(message, status)
    } else {
      throw error
    }
  }
}

export async function getAvailableModels() {
  const { data } = await api.models.list()
  return data
}
