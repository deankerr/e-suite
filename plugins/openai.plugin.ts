import 'server-only'
import { ENV } from '@/lib/env'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openaiCreateChatSchema, openaiModerationRequestSchema } from './openai.schema'

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

  moderation: async (input: unknown) => {
    const body = openaiModerationRequestSchema.parse(input)
    const response = await api.moderations.create(body)
    return response
  },
}

/* 
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


*/
