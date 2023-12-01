import { openrouter } from '@/lib/api/platforms/openrouter.adapters'
import { dollarsToNanoUSD } from '@/lib/utils'
import z from 'zod'
import { EngineCreate, getParamSize, writeModelResultJsonFile } from './run'

const schema = z.array(
  z
    .object({
      id: z.string(),
      name: z.string(),
      pricing: z.object({
        prompt: z.coerce.string(),
        completion: z.coerce.string(),
      }),
      context_length: z.number(),
      architecture: z.object({
        tokenizer: z.string(),
        instruct_type: z.union([z.string(), z.null()]),
      }),
      top_provider: z.object({
        max_completion_tokens: z.number(),
      }),
      per_request_limits: z.null(),
    })
    .strict(),
)

export async function processOpenRouter() {
  console.log('process openrouter')
  const response = await openrouter.getAvailableModels()
  writeModelResultJsonFile('openrouter.response', response)

  const parsed = schema.parse(response).filter((e) => e.id !== 'openrouter/auto')

  // model defs
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

  writeModelResultJsonFile('openrouter.engines', engines)

  return engines
}
