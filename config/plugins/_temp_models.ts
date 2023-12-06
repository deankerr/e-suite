import { dollarsToNanoUSD } from '@/lib/utils'

export function getParamSize(text: string) {
  const regex = /\d+(?=B)/g
  const match = text.match(regex)
  if (match) return Number(match[0]) * 1000
  return undefined
}

const modelMainTypes = [
  'chat',
  'completion',
  'instruct',
  'image',
  'textToSpeech',
  'speechToText',
  'embedding',
] as const

function or() {
  const parsed = [] as Record<string, any>[]
  const engines = parsed.map((entry) => {
    const [creatorSlug, modelSlug] = entry.id.split('/')

    const isInstruct = entry.id.includes('instruct') || entry.name.includes('Instruct')
    const category = isInstruct ? 'instruct' : 'chat'
    const creatorName = entry.name.split(':')[0] ?? creatorSlug ?? ''
    const parameterSize = getParamSize(entry.name)
    const outputTokenLimit =
      entry.top_provider.max_completion_tokens !== entry.context_length
        ? entry.top_provider.max_completion_tokens
        : undefined

    const record = {
      id: 'openrouter@' + modelSlug,
      model: modelSlug ?? entry.id,
      category,

      vendorId: 'openrouter',
      vendorModelId: entry.id,

      displayName: entry.name,
      creatorName,

      costInputNanoUsd: dollarsToNanoUSD(Number(entry.pricing.prompt) * 1000),
      costOutputNanoUsd: dollarsToNanoUSD(Number(entry.pricing.completion) * 1000),

      parameterSize,
      contextLength: entry.context_length,

      tokenizer: entry.architecture.tokenizer,
      instructType: entry.architecture.instruct_type,
      outputTokenLimit,
      isAvailable: true,
    }

    return record
  })
}

export async function processTogetherAi(readFile: string) {
  const parsed = [] as Record<string, any>[]

  const engines = parsed.map((entry) => {
    const [creatorSlug, modelSlug] = entry.name.split('/')
    const model = modelSlug?.toLowerCase() ?? entry.name
    const isInstruct = entry.name.includes('instruct') || entry.display_name.includes('Instruct')
    const parameterSizeMil = entry.num_parameters
      ? entry.num_parameters / 1_000_000
      : getParamSize(entry.name)
    const contextLength = entry.context_length

    const record = {
      id: 'togetherai@' + model,
      model,
      category: isInstruct ? 'instruct' : entry.display_type ?? 'chat',

      providerId: 'togetherai',
      providerModelId: entry.name,

      displayName: entry.display_name,
      creator: entry.creator_organization,

      costInputNanoUSD: entry.pricing.input,
      costOutputNanoUSD: entry.pricing.output,

      description: entry.description,
      url: entry.link,
      license: entry.license,
      parameterSizeMil,
      contextLength,

      promptFormat: entry.config?.prompt_format,
      stopTokens: entry.config?.stop,
    }

    return record
  })
}

/*
  OpenAPI Spec
  https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph
*/

async function fetchOpenAPISpec() {
  const res = await fetch('https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph')
  const json = await res.json()
  // fs.writeFileSync(path.join(__dirname, 'together.spec.json'), JSON.stringify(json, null, 2))
  console.log(
    '(run:) dlx openapi-typescript scripts/together/together.spec.json --output scripts/together/togetherai.d.ts',
  )
}
