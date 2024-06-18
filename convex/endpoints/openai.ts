import type { ParsedChatModelData } from '../db/endpoints'

export const openaiChatModelData = [
  {
    name: 'GPT-4o',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 128000,
    tokenizer: 'GPT',
    stop: [],

    endpointModelId: 'gpt-4o',
    pricing: {},
  },
  {
    name: 'GPT-4 Turbo with Vision',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 128000,
    tokenizer: 'GPT',
    stop: [],

    endpointModelId: 'gpt-4-turbo',
    pricing: {},
  },
  {
    name: 'GPT-4',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 8192,
    tokenizer: 'GPT',
    stop: [],

    endpointModelId: 'gpt-4',
  },
  {
    name: 'GPT-4 32k',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 32768,
    tokenizer: 'GPT',
    stop: [],

    endpointModelId: 'gpt-4-32k',
  },
  {
    name: 'GPT-3.5 Turbo',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 16385,
    tokenizer: 'GPT',
    stop: [],

    endpointModelId: 'gpt-3.5-turbo',
  },
]

export const getNormalizedModelData = () => {
  const models = openaiChatModelData.map(
    (raw): ParsedChatModelData => ({
      ...raw,
      resourceKey: `openai::openai/${raw.endpointModelId}`,
      endpoint: 'openai',
      pricing: {},
      moderated: false,
      available: true,
      hidden: false,
      internalScore: 0,
    }),
  )

  return models
}

export const OpenAIImageModels = [
  {
    model_id: 'dall-e-3',
    name: 'dall-e-3',
    creatorName: 'OpenAI',
  },
  {
    model_id: 'dall-e-2',
    name: 'dall-e-2',
    creatorName: 'OpenAI',
  },
]

const voices = ['Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer']

export const getNormalizedVoiceModelData = () => {
  return voices.map((voice) => ({
    resourceKey: `openai::${voice.toLowerCase()}`,
    endpointModelId: voice.toLowerCase(),
    name: voice,
    creatorName: 'OpenAI',
    endpoint: 'openai',
  }))
}
