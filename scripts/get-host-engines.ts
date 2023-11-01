import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { adapters } from '@/lib/api/adapters'
import { prisma } from '@/lib/db'
import { Engine } from '@prisma/client'

const openrouterPath = 'scripts/openrouter.modeldata'
const togetheraiPath = 'scripts/togetherai.modeldata'

async function updateHostEngineCache() {
  console.log('update host engine cache')
  if (existsSync(openrouterPath))
    throw new Error('Rename/remove previous cache file first: ' + openrouterPath)
  const { data: openrouterEngines } = await adapters.openrouter.models()
  await fs.writeFile(openrouterPath, JSON.stringify(openrouterEngines))

  if (existsSync(togetheraiPath))
    throw new Error('Rename/remove previous cache file first: ' + togetheraiPath)
  const togetheraiEngines = await adapters.togetherai.models()
  await fs.writeFile(togetheraiPath, JSON.stringify(togetheraiEngines))

  console.log('done')
}

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
  parameterSize: 'unknown',
  promptFormat: '',
  stopTokens: JSON.stringify([]),
  hostMaxCompletionTokens: 1,
  priceInput: '',
  priceOutput: '',
  includeParameters: JSON.stringify({}),
}

async function processEngineData() {
  console.log('process openrouter')
  await prisma.engine.deleteMany({ where: { hostId: 'openrouter' } })

  const { data: orData } = JSON.parse(await fs.readFile(openrouterPath, 'ascii')) as {
    data: OpenRouterModelRecord[]
  }
  for (const data of orData) await parseOpenRouterRecord(data)

  console.log('process togetherai')
  await prisma.engine.deleteMany({ where: { hostId: 'togetherai' } })
  const togData = JSON.parse(await fs.readFile(togetheraiPath, 'ascii')) as TogetheraiModelRecord[]
  for (const data of togData) await parseTogetheraiRecord(data)

  console.log('done')
}

await processEngineData()

async function parseOpenRouterRecord(data: OpenRouterModelRecord) {
  const [creatorName, model] = data.id.split('/')
  if (!(creatorName && model)) throw new Error('invalid data')

  const parNum = getMatch(data.name, /\d+(?=B)/g)

  await prisma.engine.create({
    data: {
      ...fallbackEngineValues,
      id: `openrouter::${model}`.toLowerCase(),
      type: 'chat',
      model,
      host: {
        connect: {
          id: 'openrouter',
        },
      },
      displayName: data.name,
      creatorName,
      contextLength: data.context_length,
      parameterSize: parNum ?? '',
      hostMaxCompletionTokens: data.top_provider.max_completion_tokens,
      priceInput: data.pricing.prompt,
      priceOutput: data.pricing.completion,
      includeParameters: JSON.stringify({ model: data.id, stream: true }),
    },
  })
}

function nanodollarsToDollars(n: number) {
  return (n * 4000) / 1000000
}

async function parseTogetheraiRecord(data: TogetheraiModelRecord) {
  const [_, model] = data.name.split('/')
  if (!model) throw new Error('invalid data')

  await prisma.engine.create({
    data: {
      ...fallbackEngineValues,
      id: `togetherai::${data.name}`.toLowerCase(),
      type: data.display_type,
      model,
      hostId: 'togetherai',
      displayName: data.display_name,
      creatorName: data.creator_organization,
      releaseDate: parseDate(data.release_date),
      description: data.description,
      url: data.link,
      license: data.license,
      licenseUrl: '',
      contextLength: data.context_length ?? 1,
      parameterSize: getMatch(data.display_name, /\d+(?=B)/g) ?? '',
      promptFormat: data.config?.prompt_format ?? '',
      stopTokens: JSON.stringify(data.config?.stop ?? ''),
      hostMaxCompletionTokens: data.context_length ?? 1,
      priceInput: nanodollarsToDollars(data.pricing.input).toString(),
      priceOutput: nanodollarsToDollars(data.pricing.output).toString(),
      includeParameters: JSON.stringify({ model: data.name, stream_tokens: true }),
    },
  })
}

function getMatch(text: string, regex: RegExp) {
  const match = text.match(regex)
  return match ? match[0] : undefined
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
