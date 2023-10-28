import { createErrorResponse } from '@/lib/api'
import { ExcludeNullProps } from '@/lib/types'
import { logger, raise } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { z } from 'zod'

const log = logger.child({}, { msgPrefix: '[provider/openai] ' })

const api = new OpenAI()

export const openai = {
  chat,
  chatModerated,
  image,
}

async function chat(input: OpenAI.Chat.ChatCompletionCreateParams) {
  if (input.stream) {
    const response = await api.chat.completions.create(input)
    const stream = OpenAIStream(response)
    log.info('chat stream')
    return new StreamingTextResponse(stream)
  } else {
    const response = await api.chat.completions.create(input)
    const item = response.choices[0]?.message.content ?? raise('response missing expected data')
    log.info(item, 'chat')
    return new Response(item)
  }
}

async function chatModerated(input: OpenAI.Chat.ChatCompletionCreateParams) {
  log.info('chatModerated')
  const messages = input.messages.map((m) => `${m.content}`)
  const response = await api.moderations.create({ input: messages })
  const flagged = input.messages.filter((_, i) => response.results[i]?.flagged)

  if (flagged.length === 0) {
    log.info('allow chat')
    return chat(input)
  } else {
    log.warn(flagged, 'reject chat')
    const message = `OpenAI Moderation rejected: ${flagged.map((m) => `"${m.content}"`).join(', ')}`
    return createErrorResponse(message, 403)
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

export const schemaOpenAIChatRequest = z.object({
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system', 'function']),
      name: z.string().optional(),
      content: z.string(),
    }),
  ),
  stream: z.union([z.boolean(), z.null()]).optional(),

  frequency_penalty: z.union([z.number(), z.null()]).optional(),
  function_call: z.unknown().optional(), // TODO
  functions: z.unknown().optional(), // TODO
  logit_bias: z.union([z.record(z.number()), z.null()]).optional(),
  max_tokens: z.union([z.number(), z.null()]).optional(),
  n: z.union([z.number(), z.null()]).optional(),
  presence_penalty: z.union([z.number(), z.null()]).optional(),
  stop: z.union([z.string(), z.null(), z.string().array()]).optional(),
  temperature: z.union([z.number(), z.null()]).optional(),
  top_p: z.union([z.number(), z.null()]).optional(),
  user: z.string().optional(),
})

// remove null from all props, remove non-array string from 'stop'
export type OpenAIInferenceParameters = ExcludeNullProps<
  Omit<z.infer<typeof schemaOpenAIChatRequest>, 'stop'>
> & { stop?: string[] }
