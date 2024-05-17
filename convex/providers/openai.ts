const chatModels = [
  {
    model_id: 'gpt-4o',
    name: 'GPT-4o',
    creator: 'OpenAI',
    contextLength: 128000,
  },
  {
    model_id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo with Vision',
    creator: 'OpenAI',
    contextLength: 128000,
  },
  {
    model_id: 'gpt-4',
    name: 'GPT-4',
    creator: 'OpenAI',
    contextLength: 8192,
  },
  {
    model_id: 'gpt-4-32k',
    name: 'GPT-4 32k',
    creator: 'OpenAI',
    contextLength: 32768,
  },
  {
    model_id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    creator: 'OpenAI',
    contextLength: 16385,
    outputMaxTokens: 4096,
  },
]

const textToImageModels = [
  {
    model_id: 'dall-e-3',
    name: 'dall-e-3',
    creator: 'OpenAI',
  },
  {
    model_id: 'dall-e-2',
    name: 'dall-e-2',
    creator: 'OpenAI',
  },
]

export const openai = {
  models: {
    chat: chatModels,
    textToImage: textToImageModels,
  },
}
