/*
  OpenAPI Spec
  https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph
*/
import fs from 'node:fs'
import path from 'node:path'
import { getAvailableModels } from '@/lib/api/platforms/togetherai.adapters'
import z from 'zod'
import { EngineCreate, getParamSize, writeModelResultJsonFile } from './run'

const schema = z.array(
  z
    .object({
      modelInstanceConfig: z.unknown(),
      _id: z.string(),
      name: z.string(),
      display_name: z.string(),
      display_type: z.string().optional(),
      description: z.string(),
      license: z.string(),
      creator_organization: z.string(),
      hardware_label: z.string().optional(),
      pricing_tier: z.string().optional(),
      access: z.string().optional(),
      num_parameters: z.coerce.number().optional(),
      release_date: z.string().optional(),
      show_in_playground: z.coerce.boolean().optional(),
      finetuning_supported: z.boolean().optional(),
      isFeaturedModel: z.boolean().optional(),
      external_pricing_url: z.string().optional(),
      context_length: z.number().optional(),
      config: z
        .object({
          stop: z.string().array().optional(),
          prompt_format: z.string().optional(),
          height: z.number().optional(),
          width: z.number().optional(),
          steps: z.number().optional(),
          number_of_images: z.number().optional(),
          seed: z.number().optional(),
        })
        .optional(),
      max_tokens: z.number().optional(),
      pricing: z.object({
        hourly: z.number(),
        input: z.number(),
        output: z.number(),
      }),
      created_at: z.string().optional(),
      update_at: z.string().optional(),
      autopilot_pool: z.unknown().optional(),
      instances: z.unknown().optional(),
      link: z.string().optional(),
      descriptionLink: z.string().optional(),
      depth: z.unknown().optional(),
    })
    .strict(),
)

export async function processTogetherAi(readFile: string) {
  console.log('process togetherai')
  // const response = await getAvailableModels()
  // writeModelResultJsonFile('togetherai.response.json', response)
  const response = JSON.parse(fs.readFileSync(readFile, 'ascii'))

  const parsed = schema.parse(response)

  const engines = parsed.map((entry) => {
    const [creatorSlug, modelSlug] = entry.name.split('/')
    const model = modelSlug?.toLowerCase() ?? entry.name
    const isInstruct = entry.name.includes('instruct') || entry.display_name.includes('Instruct')
    const parameterSize = entry.num_parameters
      ? String(entry.num_parameters)
      : getParamSize(entry.name)
    const contextLength = entry.context_length ? String(entry.context_length) : undefined

    const record: EngineCreate = {
      id: 'togetherai@' + model,
      model,
      type: isInstruct ? 'instruct' : entry.display_type ?? 'chat',

      providerId: 'togetherai',
      providerModelId: entry.name,

      displayName: entry.display_name,
      creator: entry.creator_organization,

      costInputNanoUSD: entry.pricing.input,
      costOutputNanoUSD: entry.pricing.output,

      description: entry.description,
      url: entry.link,
      license: entry.license,
      parameterSize,
      contextLength,

      promptFormat: entry.config?.prompt_format,
      stopTokens: entry.config?.stop,
    }

    return record
  })

  writeModelResultJsonFile('togetherai.engines', engines)
  return engines
}

async function fetchOpenAPISpec() {
  const res = await fetch('https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph')
  const json = await res.json()
  fs.writeFileSync(path.join(__dirname, 'together.spec.json'), JSON.stringify(json, null, 2))
  console.log(
    '(run:) dlx openapi-typescript scripts/together/together.spec.json --output scripts/together/togetherai.d.ts',
  )
}
