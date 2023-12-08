import 'server-only'
import { InsertModel, InsertResource } from '@/data/admin/resource.dal'
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
    processList: (listData: unknown) => {
      const parse = openrouterSchema.models.list.safeParse(listData)
      if (!parse.success) {
        console.warn('Failed to parse list data: %o', parse.error)
        return
      }
      console.log('openrouter start input', parse.data.length)
      const results: InsertResource[] = []

      const getIsRestricted = (id: string) =>
        id.startsWith('openai/gpt-4') && id !== 'openai/gpt-4-1106-preview'

      for (const item of parse.data) {
        console.log('proc id', item.name)
        if (item.id === 'openrouter/auto') continue
        const model: Partial<InsertModel> = {
          id: item.name.toLowerCase(),
          category: 'chat',
          name: item.name,
          isRestricted: getIsRestricted(item.id),
          contextLength: item.context_length,
          architecture: item.architecture.tokenizer,
          instructType: item.architecture.instruct_type,
        }

        const resource: InsertResource = {
          id: 'openrouter@' + item.id,
          modelId: item.id,
          vendorId: 'openrouter',
          isRestricted: getIsRestricted(item.id),
          isAvailable: true,
          endpointModel: item.id,
          inputCost1KTokens: Number(item.pricing.prompt) * 1000,
          outputCost1KTokens: Number(item.pricing.completion) * 1000,
          tokenOutputLimit: item.top_provider.max_completion_tokens,
          vendorModelData: model,
        }
        results.push(resource)
      }

      console.log('openrouter built', results.length)
      return results
    },
  },
}

export async function getAvailableModels() {
  console.log('fetching openrouter model list')
  const response = await fetch('https://openrouter.ai/api/v1/models')
  const json = await response.json()
  return json.data
}
