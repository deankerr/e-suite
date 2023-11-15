/*
  OpenAPI Spec
  https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph
*/

import fs from 'node:fs'
import path from 'node:path'
import { models } from '@/lib/api/platforms/togetherai.adapters'
import z from 'zod'
import { ModelMergedDef } from '../provider-models/merge'

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

async function fetchOpenAPISpec() {
  const res = await fetch('https://dash.readme.com/api/v1/api-registry/4l0rm10lnxv6fph')
  const json = await res.json()
  fs.writeFileSync(path.join(__dirname, 'together.spec.json'), JSON.stringify(json, null, 2))
  console.log(
    '(run:) dlx openapi-typescript scripts/together/together.spec.json --output scripts/together/togetherai.d.ts',
  )
}

async function fetchModels() {
  const data = await models()
  fs.writeFileSync(path.join(__dirname, 'together.1.response.json'), JSON.stringify(data, null, 2))
  return data
}

async function refine(data: unknown) {
  const parsed = schema.parse(data)
  // create list
  const list = parsed.map((m) => m.name.toLowerCase()).sort()
  fs.writeFileSync(path.join(__dirname, 'together.2.list.json'), JSON.stringify(list, null, 2))

  // process into e/suite structure
  const models = parsed.map((entry) => {
    const model: ModelMergedDef = {
      id: entry.name.toLowerCase(),
      displayName: entry.display_name,
      category: entry.display_type ?? '',
      description: entry.description,
      descriptionLink: entry.descriptionLink ?? '',
      link: entry.link ?? '',
      license: entry.license,
      creator: entry.creator_organization,
      parameterSize: String(entry.num_parameters) ?? '',
      contextLength: String(entry.context_length),
      tokenizer: '', // OAI
      instructType: '', // OAI
      promptFormat: entry.config?.prompt_format ?? '',
      stop: entry.config?.stop ?? [],
    }

    return model
  })

  fs.writeFileSync(path.join(__dirname, 'together.3.defs.json'), JSON.stringify(models, null, 2))
}

async function main() {
  // await fetchOpenAPISpec()
  // const data = await fetchModels()
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'together.1.response.json'), 'ascii'),
  )
  await refine(data)
}

main().then(() => console.log('Done'))

/* 
depth: z.object({
      num_asks: z.number(),
      num_bids: z.number(),
      num_running: z.number(),
      asks: z.record(z.number()),
      asks_updated: z.string(),
      gpus: z.record(z.number()),
      qps: z.number(),
      permit_required: z.boolean(),
      price: z.object({
        base: z.number(),
        finetune: z.number(),
        hourly: z.number(),
        input: z.number(),
        output: z.number(),
      }),
    }),

*/
