import { openai } from '@/lib/api/platforms/openai.adapters'
import z from 'zod'
import { EngineCreate } from './run'

async function fetchModels() {
  const schema = z.array(
    z
      .object({
        id: z.string(),
        object: z.string(),
        created: z.number(),
        owned_by: z.string(),
      })
      .strict(),
  )
  return schema.parse(await openai.getAvailableModels())
}

async function categories(ids: string[]) {
  const categories = {
    chat: [] as string[],
    instruct: [] as string[],
    image: [] as string[],
    textToSpeech: [] as string[],
    speechToText: [] as string[],
    embedding: [] as string[],
    legacy: [] as string[],
    unknown: [] as string[],
  }

  for (const id of ids) {
    if (id.includes('embedding')) categories.embedding.push(id)
    else if (id.includes('tts')) categories.textToSpeech.push(id)
    else if (id.includes('whisper')) categories.speechToText.push(id)
    else if (id.includes('dall')) categories.image.push(id)
    else if (id.includes('gpt')) {
      if (id.includes('instruct')) categories.instruct.push(id)
      else categories.chat.push(id)
    } else if (['ada', 'babbage', 'curie', 'davinci'].some((i) => id.includes(i)))
      categories.legacy.push(id)
    else categories.unknown.push(id)
  }
}

export function processOpenAi() {
  return openaiStaticModelData
}

export const openaiStaticModelData: EngineCreate[] = [
  {
    id: 'openai@gpt-3.5-turbo',
    model: 'openai/gpt-3.5-turbo',
    category: 'chat',

    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo',

    displayName: 'OpenAI: GPT-3.5 Turbo',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 4_096,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-instruct',
    model: 'openai/gpt-3.5-turbo-instruct',
    category: 'instruct',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-instruct',
    displayName: 'OpenAI: GPT-3.5 Turbo Instruct',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 4_096,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-instruct-0914',
    model: 'openai/gpt-3.5-turbo-instruct-0914',
    category: 'instruct',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-instruct-0914',
    displayName: 'OpenAI: GPT-3.5 Turbo Instruct (v0914)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 4_096,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-0301',
    model: 'openai/gpt-3.5-turbo-0301',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-0301',
    displayName: 'OpenAI: GPT-3.5 Turbo (v0301)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 4_096,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-0613',
    model: 'openai/gpt-3.5-turbo-0613',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-0613',
    displayName: 'OpenAI: GPT-3.5 Turbo (v0613)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 4_096,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-1106',
    model: 'openai/gpt-3.5-turbo-1106',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-1106',
    displayName: 'OpenAI: GPT-3.5 Turbo (v0613)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens.',
    url: 'https://openai.com',
    contextLength: 16_385,
    tokenizer: 'GPT',
    isAvailable: true,
    outputTokenLimit: 4_096,
  },

  {
    id: 'openai@gpt-3.5-turbo-16k',
    model: 'openai/gpt-3.5-turbo-16k',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-16k',
    displayName: 'OpenAI: GPT-3.5 Turbo 16K',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 16_385,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-3.5-turbo-16k-0613',
    model: 'openai/gpt-3.5-turbo-16k-0613"',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-3.5-turbo-16k-0613',
    displayName: 'OpenAI: GPT-3.5 Turbo 16K (v0613)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 250,
    costOutputNanoUsd: 500,
    description:
      'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat Completions API but works well for traditional completions tasks as well.',
    url: 'https://openai.com',
    contextLength: 16_385,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-4',
    model: 'openai/gpt-4',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-4',
    displayName: 'OpenAI: GPT-4',
    creatorName: 'OpenAI',
    costInputNanoUsd: 2_500,
    costOutputNanoUsd: 7_500,
    description:
      'GPT-4 is a large multimodal model (accepting text or image inputs and outputting text) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. GPT-4 is available in the OpenAI API to paying customers. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat Completions API.',
    url: 'https://openai.com',
    contextLength: 8_192,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-4-0314',
    model: 'openai/gpt-4-0314',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-4-0314',
    displayName: 'OpenAI: GPT-4 (v0314)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 2_500,
    costOutputNanoUsd: 7_500,
    description:
      'GPT-4 is a large multimodal model (accepting text or image inputs and outputting text) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. GPT-4 is available in the OpenAI API to paying customers. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat Completions API.',
    url: 'https://openai.com',
    contextLength: 8_192,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-4-0613',
    model: 'openai/gpt-4-0613',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-4-0613',
    displayName: 'OpenAI: GPT-4 (v0613)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 2_500,
    costOutputNanoUsd: 7_500,
    description:
      'GPT-4 is a large multimodal model (accepting text or image inputs and outputting text) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. GPT-4 is available in the OpenAI API to paying customers. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat Completions API.',
    url: 'https://openai.com',
    contextLength: 8_192,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-4-1106-preview',
    model: 'openai/gpt-4-1106-preview',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-4-1106-preview',
    displayName: 'OpenAI: GPT-4 Turbo (preview)',
    creatorName: 'OpenAI',
    costInputNanoUsd: 2_500,
    costOutputNanoUsd: 7_500,
    description:
      'The latest GPT-4 model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens. This preview model is not yet suited for production traffic.',
    url: 'https://openai.com',
    contextLength: 128_000,
    tokenizer: 'GPT',
    isAvailable: true,
  },

  {
    id: 'openai@gpt-4-vision-preview',
    model: 'openai/gpt-4-vision-preview',
    category: 'chat',
    vendorId: 'openai',
    vendorModelId: 'gpt-4-vision-preview',
    displayName: 'OpenAI: GPT-4 Turbo with vision',
    creatorName: 'OpenAI',
    costInputNanoUsd: 2_500,
    costOutputNanoUsd: 7_500,
    description:
      'Ability to understand images, in addition to all other GPT-4 Turbo capabilities. Returns a maximum of 4,096 output tokens. This is a preview model version and not suited yet for production traffic.',
    url: 'https://openai.com',
    contextLength: 128_000,
    tokenizer: 'GPT',
    isAvailable: true,
    comment: 'Additional cost incurred per image size',
  },
]
