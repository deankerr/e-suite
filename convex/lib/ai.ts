import { createOpenAI, openai } from '@ai-sdk/openai'
import { ConvexError } from 'convex/values'
import * as vb from 'valibot'

import { ENV } from '../lib/env'
import { ResourceKey } from '../lib/valibot'

const createProvider = (endpoint: string) => {
  switch (endpoint) {
    case 'openai':
      return openai

    case 'together':
      return createOpenAI({
        apiKey: ENV.TOGETHER_API_KEY,
        baseURL: 'https://api.together.xyz/v1',
      })

    case 'openrouter':
      return createOpenAI({
        apiKey: ENV.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      })
  }

  throw new ConvexError(`invalid endpoint: ${endpoint}`)
}

export const createAi = (resourceKey: string) => {
  const { endpoint, modelId } = vb.parse(ResourceKey, resourceKey)

  const provider = createProvider(endpoint)

  return {
    model: provider(modelId),
    provider,
  }
}
