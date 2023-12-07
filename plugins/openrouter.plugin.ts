import 'server-only'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openrouterSchema } from './openrouter.schema'

const api = new OpenAI({
  apiKey: ENV.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': ENV.APP_SITE_URL,
  },
})

export const openrouterPlugin = {
  chat: {
    completions: async ({ input, log }: RouteContext) => {
      const body = openrouterSchema.chat.completions.request.parse(input)
      log.add('vendorRequestBody', body)

      //* streaming response
      if (body.stream) {
        const response = await api.chat.completions.create(
          body as OpenAI.ChatCompletionCreateParamsStreaming,
        )
        const stream = OpenAIStream(response)
        log.add('vendorResponseBody', 'is_streaming')
        return new StreamingTextResponse(stream)
      }

      //* json response
      const response = await api.chat.completions.create(
        body as OpenAI.ChatCompletionCreateParamsNonStreaming,
      )

      log.add('vendorResponseBody', response)
      return Response.json(response)
    },
  },

  models: {
    list: async () => {
      const { data } = await api.models.list()
      return data
    },
  },
}

export async function getAvailableModels() {
  console.log('fetching openrouter model list')
  const response = await fetch('https://openrouter.ai/api/v1/models')
  const json = await response.json()
  return json.data
}
