import { createErrorResponse, handleChatError } from '@/lib/api/api'
import { EChatRequestSchema } from '@/lib/api/schemas'
import { logger, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { schemas } from '../schemas'

const log = logger.child({}, { msgPrefix: '[provider/openai] ' })

export const openai = {
  chat: chatModerated,
}

const api = new OpenAI()

async function chat(chatRequest: EChatRequestSchema) {
  try {
    const body = schemas.openai.chat.input.parse(chatRequest)

    if (body.stream === true) {
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

async function chatModerated(chatRequest: EChatRequestSchema) {
  try {
    const body = schemas.openai.chat.input.parse(chatRequest)
    const messages = body.messages.map((m) => `${m.content}`)
    const response = await api.moderations.create({ input: messages })
    const flagged = body.messages.filter((_, i) => response.results[i]?.flagged)

    if (flagged.length === 0) {
      log.info('allow chat')
      return chat(chatRequest)
    } else {
      log.warn(flagged, 'reject chat')
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
    log.info(item, 'image')
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

const chatModels = [
  'gpt-4',
  // 'gpt-4-0314',
  // 'gpt-4-0613',
  // 'gpt-4-32k',
  // 'gpt-4-32k-0314',
  // 'gpt-4-32k-0613',
  'gpt-3.5-turbo',
  // 'gpt-3.5-turbo-16k',
  // 'gpt-3.5-turbo-0301',
  // 'gpt-3.5-turbo-0613',
  // 'gpt-3.5-turbo-16k-0613',
]

/* /models sample
{
      id: 'davinci-instruct-beta',
      object: 'model',
      created: 1649364042,
      owned_by: 'openai',
      permission: [Array],
      root: 'davinci-instruct-beta',
      parent: null
    },
    {
      id: 'gpt-3.5-turbo-0613',
      object: 'model',
      created: 1686587434,
      owned_by: 'openai',
      permission: [Array],
      root: 'gpt-3.5-turbo-0613',
      parent: null
    },
    {
      id: 'text-similarity-babbage-001',
      object: 'model',
      created: 1651172505,
      owned_by: 'openai-dev',
      permission: [Array],
      root: 'text-similarity-babbage-001',
      parent: null
    },
    {
      id: 'text-search-davinci-doc-001',
      object: 'model',
      created: 1651172505,
      owned_by: 'openai-dev',
      permission: [Array],
      root: 'text-search-davinci-doc-001',
      parent: null
    },
    {
      id: 'gpt-4-0314',
      object: 'model',
      created: 1687882410,
      owned_by: 'openai',
      permission: [Array],
      root: 'gpt-4-0314',
      parent: null
    },
    {
      id: 'gpt-4-0613',
      object: 'model',
      created: 1686588896,
      owned_by: 'openai',
      permission: [Array],
      root: 'gpt-4-0613',
      parent: null
    },
    {
      id: 'gpt-4',
      object: 'model',
      created: 1687882411,
      owned_by: 'openai',
      permission: [Array],
      root: 'gpt-4',
      parent: null
    },
    {
      id: 'babbage-similarity',
      object: 'model',
      created: 1651172505,
      owned_by: 'openai-dev',
      permission: [Array],
      root: 'babbage-similarity',
      parent: null
    },
    {
      id: 'text-embedding-ada-002',
      object: 'model',
      created: 1671217299,
      owned_by: 'openai-internal',
      permission: [Array],
      root: 'text-embedding-ada-002',
      parent: null
    },

*/
