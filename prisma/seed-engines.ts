import fs from 'node:fs/promises'
import { prisma } from '@/lib/prisma'
import { Engine } from '@prisma/client'

const fallbackEngineValues: Omit<Engine, 'hostId' | 'createdAt' | 'updatedAt'> = {
  id: '',
  type: '',
  model: '',
  displayName: '',
  creatorName: '',
  releaseDate: new Date('30 Dec 1999'),
  description: '',
  url: '',
  license: '',
  licenseUrl: '',
  contextLength: 1,
  parameterSize: '',
  promptFormat: '',
  stopTokens: JSON.stringify([]),
  hostMaxCompletionTokens: 1,
  priceInput: '',
  priceOutput: '',
  includeParameters: JSON.stringify({}),
}

async function createOpenRouterEngines() {
  const cache = await fs.readFile('data/openrouter.modelcache.json', 'ascii')
  const models = JSON.parse(cache) as OpenRouterModelRecord[]

  for (const item of models) {
    const engine = { ...fallbackEngineValues }

    const [creatorName, model] = item.id.split('/')
    if (!(creatorName && model)) throw new Error('invalid data')

    const parameterSize = getParamSize(item.name) ?? ''

    Object.assign(engine, {
      id: `openrouter::${model}`.toLowerCase(),
      type: 'chat',
      model,
      displayName: item.name,
      creatorName,
      contextLength: item.context_length,
      parameterSize,
      hostMaxCompletionTokens: item.top_provider.max_completion_tokens,
      priceInput: item.pricing.prompt,
      priceOutput: item.pricing.completion,
      includeParameters: JSON.stringify({ model: item.id, stream: true }),
    })

    await prisma.engine.create({
      data: {
        ...engine,
        host: {
          connect: {
            id: 'openrouter',
          },
        },
      },
    })
  }
  console.log('done')
}

async function createTogetheraiEngines() {
  const cache = await fs.readFile('data/togetherai.modelcache.json', 'ascii')
  const models = JSON.parse(cache) as TogetheraiModelRecord[]

  for (const item of models) {
    const engine = { ...fallbackEngineValues }

    const [creatorName, model] = item.name.split('/')
    if (!(creatorName && model)) throw new Error('invalid data')
    const parameterSize = getParamSize(item.name) ?? ''

    Object.assign(engine, {
      id: `togetherai::${model}`.toLowerCase(),
      type: item.display_type,
      model,
      displayName: item.display_name,
      creatorName: item.creator_organization,
      releaseDate: parseDate(item.release_date),
      description: item.description,
      url: item.link,
      license: item.license,
      contextLength: item.context_length ?? 1,
      parameterSize,
      promptFormat: item.config?.prompt_format ?? '',
      stopTokens: JSON.stringify(item.config?.stop) ?? '[]',
      hostMaxCompletionTokens: item.context_length ?? 1,
      priceInput: nanodollarsToDollars(item.pricing.input).toString(),
      priceOutput: nanodollarsToDollars(item.pricing.output).toString(),
      includeParameters: JSON.stringify({ model: item.name, stream_tokens: false }),
    })

    await prisma.engine.create({
      data: {
        ...engine,
        host: {
          connect: {
            id: 'togetherai',
          },
        },
      },
    })
  }
}

const openaiCommon = {
  creatorName: 'OpenAI',
  url: 'https://openai.com',
  license: 'OpenAI',
  licenseUrl: 'https://openai.com',
  promptFormat: '',
  stopTokens: JSON.stringify([]),
  type: 'chat',
  hostId: 'openai',
}

async function createOpenAiEngines() {
  await prisma.engine.create({
    data: {
      ...openaiCommon,
      id: 'openai::gpt-3.5-turbo',
      model: 'openai/gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      releaseDate: new Date('01 Mar 2023').toISOString(),
      description:
        'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat completions API but works well for traditional completions tasks as well.',
      contextLength: 4097,
      parameterSize: '175',
      hostMaxCompletionTokens: 4097,
      priceInput: '0.0015',
      priceOutput: '0.002',
      includeParameters: JSON.stringify({ model: 'gpt-3.5-turbo', stream: true }),
    },
  })

  await prisma.engine.create({
    data: {
      ...openaiCommon,
      id: 'openai::gpt-3.5-turbo-16k',
      model: 'gpt-3.5-turbo-16k',
      displayName: 'GPT-3.5 Turbo 16K',
      releaseDate: new Date('01 Mar 2023').toISOString(),
      description:
        'GPT-3.5 models can understand and generate natural language or code. Our most capable and cost effective model in the GPT-3.5 family is gpt-3.5-turbo which has been optimized for chat using the Chat completions API but works well for traditional completions tasks as well.',
      contextLength: 16_385,
      parameterSize: '175',
      hostMaxCompletionTokens: 16_385,
      priceInput: '0.003',
      priceOutput: '0.004',
      includeParameters: JSON.stringify({ model: 'gpt-3.5-turbo-16k', stream: true }),
    },
  })

  await prisma.engine.create({
    data: {
      ...openaiCommon,
      id: 'openai::gpt-3.5-turbo-instruct',
      type: 'completion',
      model: 'openai/gpt-3.5-turbo-instruct',
      displayName: 'GPT-3.5 Turbo Instruct',
      releaseDate: new Date('19 Sep 2023').toISOString(),
      description:
        "GPT-3.5 Turbo Instruct is an InstructGPT 3.5 class model. It's trained similarly to previous Instruct models such as the text-davinci series while maintaining the same speed as our Turbo models.",
      contextLength: 4097,
      parameterSize: '175',
      hostMaxCompletionTokens: 4097,
      priceInput: '0.0015',
      priceOutput: '0.002',
      includeParameters: JSON.stringify({ model: 'gpt-3.5-turbo-instruct', stream: true }),
    },
  })

  await prisma.engine.create({
    data: {
      ...openaiCommon,
      id: 'openai::gpt-4',
      model: 'gpt-4',
      displayName: 'GPT-4',
      releaseDate: new Date('14 Mar 2023').toISOString(),
      description:
        'GPT-4 is a large multimodal model (accepting text inputs and emitting text outputs today, with image inputs coming in the future) that can solve difficult problems with greater accuracy than any of our previous models, thanks to its broader general knowledge and advanced reasoning capabilities. Like gpt-3.5-turbo, GPT-4 is optimized for chat but works well for traditional completions tasks using the Chat completions API.',
      contextLength: 8192,
      parameterSize: '1760',
      hostMaxCompletionTokens: 8192,
      priceInput: '0.03',
      priceOutput: '0.06',
      includeParameters: JSON.stringify({ model: 'gpt-4', stream: true }),
    },
  })

  await prisma.engine.create({
    data: {
      ...openaiCommon,
      id: 'openai::gpt-4-32k',
      model: 'gpt-4-32k',
      displayName: 'GPT-4 32K',
      releaseDate: new Date('14 Mar 2023').toISOString(),
      description: 'Same capabilities as the standard gpt-4 mode but with 4x the context length.',
      contextLength: 32_768,
      parameterSize: '1760',
      hostMaxCompletionTokens: 32_768,
      priceInput: '0.06',
      priceOutput: '0.12',
      includeParameters: JSON.stringify({ model: 'gpt-4-32k', stream: true }),
    },
  })
}

export async function seedEngineData() {
  await createOpenAiEngines()
  await createOpenRouterEngines()
  await createTogetheraiEngines()
}

function getParamSize(text: string) {
  const regex = /\d+(?=B)/g
  const match = text.match(regex)
  if (match) return match[0]
  return undefined
}

function nanodollarsToDollars(n: number) {
  return (n * 4000) / 1000000
}

function parseDate(value: unknown) {
  const unknown = new Date('31 Dec 1999')

  if (typeof value !== 'string') return unknown
  try {
    return new Date(value)
  } catch (err) {
    return unknown
  }
}

type TogetheraiModelRecord = {
  modelInstanceConfig: { appearsIn: string[]; order: number }
  _id: string
  name: string
  display_name: string
  display_type: string
  description: string
  license: string
  creator_organization: string
  hardware_label: string
  num_parameters: number
  release_date: string
  show_in_playground: boolean
  isFeaturedModel: boolean
  context_length: number
  config: {
    stop: string[]
    prompt_format: string
  }
  pricing: { input: number; output: number; hourly: number }
  created_at: string
  update_at: string
  access: string
  link: string
  descriptionLink: string
  depth: {}
}

type OpenRouterModelRecord = {
  id: string
  name: string
  pricing: {
    prompt: string
    completion: string
    discount: number
  }
  context_length: number
  top_provider: {
    max_completion_tokens: number
  }
  per_request_limits: {
    prompt_tokens: string
    completion_tokens: string
  }
}
