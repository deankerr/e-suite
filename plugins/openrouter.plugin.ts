import 'server-only'
import { InsertModels, InsertResources } from '@/data/types'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { truncateFloat } from '@/lib/utils'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openrouterSchema } from './openrouter.schema'

const vendorId = 'openrouter' as const

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
      if (!parse.success) return console.warn('%s failed to parse list: %o', vendorId, parse.error)
      console.log('openrouter: %d items', parse.data.length)

      const results = []

      const getIsRestricted = (id: string) =>
        id.startsWith('openai/gpt-4') &&
        !['openai/gpt-4-1106-preview', 'openai/gpt-4-vision-preview'].includes(id)

      for (const item of parse.data) {
        if (item.id === 'openrouter/auto') continue //* not a model
        console.log('%s: %s', vendorId, item.name)

        const model = {
          id: item.name.toLowerCase(),
          category: 'chat',
          name: item.name,
          contextLength: item.context_length,
          architecture: item.architecture.tokenizer,
          instructType: item.architecture.instruct_type,
        } satisfies Partial<InsertModels>

        const resource = {
          id: 'openrouter@' + item.id,
          modelAliasId: item.id,
          vendorId: 'openrouter',
          isRestricted: false,
          isAvailable: true,
          endpointModelId: item.id,
          inputCost1KTokens: truncateFloat(Number(item.pricing.prompt) * 1000),
          outputCost1KTokens: truncateFloat(Number(item.pricing.completion) * 1000),
          tokenOutputLimit: item.top_provider.max_completion_tokens,
          vendorModelData: model,
        } satisfies InsertResources
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
