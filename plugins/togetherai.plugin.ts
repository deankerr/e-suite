import 'server-only'
import { ChatRouteResponse } from '@/app/api/v1/chat/completions/route'
import { ENV } from '@/lib/env'
import { AppError } from '@/lib/error'
import { Message, messageSchema } from '@/schema/message'
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
    throw new AppError(
      'invalid_vendor_response',
      'Failed to parse the response data from Together.ai',
    )
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
  console.log('output', JSON.stringify(output, null, 2))
  const data = togetheraiChatResponseSchema.parse(output)
  const messageData = data.output.choices[0]
  if (!messageData)
    throw new AppError(
      'invalid_vendor_response',
      'Failed to parse the response data from Together.ai',
    )

  if (textOnly) return new Response(messageData.text)
  const response: ChatRouteResponse = {
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
        finish_reason: messageData.finish_reason ?? '',
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

export async function getAvailableModels() {
  console.log('fetching togetherai model list')
  const { data, error } = await GET('/models/info', {})
  console.log('data', data)
  if (error) console.error('openapi-fetch error', error)
  return data
}

// async function image(input: object) {
//   // api spec is missing image parameters
//   const { data, error } = await POST('/inference', { body: input })
//   if (data) {
//     const response = schemas.togetherai.image.output.parse(data)
//     const base64 =
//       response.output.choices[0]?.image_base64 ?? raise('response missing expected data')
//     return { response, item: { base64 } }
//   } else {
//     console.error(error)
//     throw new Error('Unknown togetherai error')
//   }
// }
