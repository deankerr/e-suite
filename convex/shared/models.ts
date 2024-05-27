import { OpenAIChatModels } from '../endpoints/openai'
import OpenRouterModels from '../endpoints/openrouter.models.json'
import TogetherModels from '../endpoints/together.models.json'

import type { ChatModel } from './structures'

const excludeChatModels = [
  'openai/gpt-3.5-turbo-0125',
  'openai/gpt-3.5-turbo-0301',
  'openai/gpt-3.5-turbo-0613',
  'openai/gpt-3.5-turbo-1106',
  'openai/gpt-4-0314',
  'openai/gpt-4-1106-preview',
  'openai/gpt-4-32k-0314',
  'openai/gpt-4-turbo-preview',
  'openai/gpt-4o-2024-05-13',
  'openrouter/auto',
  'meta-llama/llama-guard-2-8b',
]

export const chatModels: ChatModel[] = [
  OpenAIChatModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'openai',
    endpointModelId: model.model_id,
    name: model.name,
    creatorName: 'OpenAI',
    contextLength: model.contextLength,
  })),
  OpenRouterModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'openrouter',
    endpointModelId: model.id,
    name: model.name,
    contextLength: model.context_length,
  })),
  TogetherModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'together',
    endpointModelId: model.model_id,
    name: model.name,
    contextLength: model.contextLength,
  })),
]
  .flat()
  .filter((model) => !excludeChatModels.includes(model.endpointModelId))
