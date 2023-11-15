import fs from 'node:fs'
import path from 'node:path'
import { models } from '@/lib/api/platforms/openrouter.adapters'
import z from 'zod'
import { ModelMergedDef } from '../provider-models/merge'

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

async function fetchModels() {
  const data = await models()
  fs.writeFileSync(
    path.join(__dirname, 'openrouter.1.response.json'),
    JSON.stringify(data, null, 2),
  )
  return data
}

async function refine(data: unknown) {
  const parsed = schema.parse(data)
  // create list
  const list = parsed.map((m) => m.id).sort()
  fs.writeFileSync(path.join(__dirname, 'openrouter.2.list.json'), JSON.stringify(list, null, 2))

  // model defs
  const models = parsed.map((entry) => {
    const model: ModelMergedDef = {
      id: entry.id.toLowerCase(),
      displayName: entry.name,
      category: '', // can guess from name
      description: '',
      descriptionLink: '',
      link: '',
      license: '',
      creator: '', // can guess from name
      parameterSize: '', // can guess from name
      contextLength: String(entry.context_length),
      tokenizer: entry.architecture.tokenizer,
      instructType: entry.architecture.instruct_type ?? '', // OAI
      promptFormat: '',
      stop: [],
    }

    return model
  })

  fs.writeFileSync(path.join(__dirname, 'openrouter.3.defs.json'), JSON.stringify(models, null, 2))
}

async function main() {
  console.log('process OpenRouter models')
  const data = await fetchModels()
  await refine(data)
}

main().then(() => console.log('Done'))
