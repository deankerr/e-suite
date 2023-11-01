import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { join } from 'node:path'
import { adapters } from '@/lib/api/adapters'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/utils'
import { Engine } from '@prisma/client'

const dataDir = 'data'
const fileExt = '.modelcache.json'

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

async function updateOpenRouterModels() {
  console.log('update openrouter cache')
  const path = join(dataDir, 'openrouter' + fileExt)

  let models: OpenRouterModelRecord[]
  if (existsSync(path)) {
    console.log('reusing cached data', path)
    const cache = await fs.readFile(path, 'ascii')
    models = JSON.parse(cache)
  } else {
    models = await adapters.openrouter.models()
    await fs.writeFile(path, JSON.stringify(models, null, 2))
    console.log('model cache updated')
  }

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

async function updateTogetheraiModels() {
  console.log('update togetherai cache')
  const path = join(dataDir, 'togetherai' + fileExt)

  let models: TogetheraiModelRecord[]
  if (existsSync(path)) {
    console.log('reusing cached data', path)
    const cache = await fs.readFile(path, 'ascii')
    models = JSON.parse(cache)
  } else {
    models = (await adapters.togetherai.models()) as TogetheraiModelRecord[]
    await fs.writeFile(path, JSON.stringify(models, null, 2))
    console.log('model cache updated')
  }

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
      includeParameters: JSON.stringify({ model: item.name, stream_tokens: true }),
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
  console.log('done')
}

export async function createHostEngines() {
  // await prisma.engine.deleteMany({ where: { hostId: 'openrouter' } })
  // await prisma.engine.deleteMany({ where: { hostId: 'togetherai' } })

  await updateOpenRouterModels()
  await updateTogetheraiModels()
}

// await main()

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
