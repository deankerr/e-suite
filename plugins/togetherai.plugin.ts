import { ENV } from '@/lib/env'
import { AppError } from '@/lib/error'
import { Message, messageSchema } from '@/schema/message'
import { ChatCompletionApiResponseSchema } from '@/schema/v1/chat'
import { nanoid } from 'nanoid/non-secure'
import createClient from 'openapi-fetch'
import z from 'zod'
import type { paths } from './togetherai.api'
import { togetheraiChatResponseSchema, togetheraiCreateChatSchema } from './togetherai.schema'

const { GET, POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${ENV.TOGETHERAI_API_KEY}`,
  },
})

export const togetheraiPlugin = {
  chat: async (input: unknown) => {
    const { messages, ...body } = togetheraiCreateChatSchema
      .merge(z.object({ messages: messageSchema.array() }))
      .parse(input)
    const prompt = convertMessagesToPromptFormat(messages)
    const { data, error } = await POST('/inference', { body: { ...body, prompt } })

    if (data) return createChatApiResponseBody(data)
    if (error) throw error
    throw new AppError('unknown_vender_response', 'Failed to parse the response from Together.ai')
  },
}

function convertMessagesToPromptFormat(messages: Message[]) {
  let prompt = ''
  for (const m of messages) {
    if (m.role === 'system') prompt = prompt.concat(m.content + '\n')
    if (m.role === 'user') prompt = prompt.concat('<human>: ' + m.content + '\n')
    if (m.role === 'assistant') prompt = prompt.concat('<bot>: ' + m.content + '\n')
  }
  prompt = prompt.concat('<bot>:')

  return prompt
}
const textOnly = true

function createChatApiResponseBody(output: unknown) {
  const data = togetheraiChatResponseSchema.parse(output)
  const messageData = data.output.choices[0]
  if (!messageData)
    throw new AppError('unknown_vender_response', 'Failed to parse the response from Together.ai')

  if (textOnly) return new Response(messageData.text)
  const response: ChatCompletionApiResponseSchema = {
    id: 'tog-' + nanoid(5),
    object: 'chat.completion',
    created: Date.now(),
    model: data.model,
    system_fingerprint: '',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: messageData.text,
        },
        finish_reason: messageData.finish_reason,
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  }

  return Response.json(response)
}

const sampleData = {
  status: 'finished',
  prompt: ['The capital of France is '],
  model: 'togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1',
  model_owner: '',
  tags: {},
  num_returns: 1,
  args: {
    model: 'togethercomputer/RedPajama-INCITE-Instruct-7B-v0.1',
    prompt: 'The capital of France is ',
    temperature: 0.8,
    top_p: 0.7,
    top_k: 50,
    max_tokens: 1,
  },
  subjobs: [],
  output: {
    choices: [
      {
        finish_reason: 'length',
        index: 0,
        text: ' Paris',
      },
    ],
    raw_compute_time: 0.06382315792143345,
    result_type: 'language-model-inference',
  },
}
