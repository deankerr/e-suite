import { asyncMap, omit } from 'convex-helpers'
import ky from 'ky'
import { z } from 'zod'

import { api, internal } from '../_generated/api'
import { logActionOpsEvent } from '../db/admin/events'
import { internalAction } from '../functions'

async function fetchModelRecords() {
  const response = await ky.get('https://openrouter.ai/api/v1/models').json()
  const parsed = z
    .object({
      data: z.array(z.unknown()),
    })
    .parse(response)
  return parsed.data
}

export const updateOpenRouterModels = internalAction({
  args: {},
  handler: async (ctx) => {
    const existingModels = await ctx.runQuery(api.db.models.listChatModels, {
      endpoint: 'openrouter',
    })
    const records = await fetchModelRecords()
    const processed = records.map(processModelRecord).filter((m) => m !== null)

    await asyncMap(processed, async (model) => {
      const existing = existingModels.find((m) => m.resourceKey === model.resourceKey)
      if (existing) {
        // * replace data of existing model
        await ctx.runMutation(internal.db.models.updateChatModel, {
          id: existing._id,
          ...model,
        })
      } else {
        // * create new model
        await ctx.runMutation(internal.db.models.createChatModel, model)
        await logActionOpsEvent(ctx, {
          message: `openrouter new model: ${model.name}`,
          type: 'notice',
        })
      }
    })

    const notFound = existingModels.filter(
      (m) => !processed.find((p) => p?.resourceKey === m.resourceKey),
    )
    await asyncMap(notFound, async (model) => {
      // * mark as unavailable
      await ctx.runMutation(internal.db.models.updateChatModel, {
        id: model._id,
        ...omit(model, ['_id', '_creationTime']),
        available: false,
      })

      await logActionOpsEvent(ctx, {
        message: `openrouter model unavailable: ${model.name}`,
        type: 'warning',
      })
    })

    await logActionOpsEvent(ctx, {
      message: `openrouter model update complete`,
      type: 'info',
    })
  },
})

function processModelRecord(record: unknown) {
  const result = orModelSchema.safeParse(record)
  if (!result.success) {
    console.error(result.error.flatten())
    console.error(record)
    return null
  }

  const { data } = result
  if (excludedModelIds.includes(data.id)) {
    return null
  }

  // * snip "self-moderated" name text
  const name = data.name.replace(/ \(self-moderated\)$/, '')

  const { creatorName, modelName } = getCreatorModelNames(name)

  const pricing = data.id.endsWith(':free')
    ? { type: 'free' as const }
    : {
        type: 'llm' as const,
        tokenInput: toPerMillionTokens(data.pricing.prompt),
        tokenOutput: toPerMillionTokens(data.pricing.completion),
        imageInput: toPerThousandTokens(data.pricing.image),
        imageOutput: toPerThousandTokens(data.pricing.request),
      }

  return {
    endpoint: 'openrouter',
    name: modelName,
    description: data.description,
    creatorName,
    link: '',
    license: '',
    tags: [],
    modelId: data.id,
    endpointModelId: data.id,
    pricing,
    moderated: data.top_provider.is_moderated,
    available: true,
    hidden: false,
    internalScore: 0,
    contextLength: data.context_length,
    tokenizer: data.architecture.tokenizer,
    type: 'chat' as const,
    resourceKey: `openrouter::${data.id}`,
  }
}

function getCreatorModelNames(name: string) {
  const [creatorName, modelName] = name.split(': ')
  if (creatorName && modelName) {
    return { creatorName, modelName }
  }
  return { creatorName: '', modelName: name }
}

function toPerMillionTokens(value: string): number {
  if (!value || value === '0') return 0
  const perToken = parseFloat(value)
  const perMillionTokens = perToken * 1000000
  return Math.round(perMillionTokens * 10000) / 10000 // Round to 4 decimal places
}

function toPerThousandTokens(value: string): number {
  if (!value || value === '0') return 0
  const perToken = parseFloat(value)
  const perThousandTokens = perToken * 1000
  return Math.round(perThousandTokens * 10000) / 10000 // Round to 4 decimal places
}

const orModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created: z.number(),
  pricing: z.object({
    prompt: z.string(),
    completion: z.string(),
    image: z.string(),
    request: z.string(),
  }),
  context_length: z.number(),
  architecture: z.object({
    modality: z.string(),
    tokenizer: z.string(),
    instruct_type: z.nullable(z.string()),
  }),
  top_provider: z.object({
    max_completion_tokens: z.nullable(z.number()),
    is_moderated: z.boolean(),
  }),
  per_request_limits: z.null(),
})

const excludedModelIds = [
  // not a chat model
  'meta-llama/llama-guard-2-8b',
  'openrouter/auto',

  // obsolete
  'openai/gpt-3.5-turbo-0125',
  'openai/gpt-3.5-turbo-0301',
  'openai/gpt-3.5-turbo-0613',
  'openai/gpt-3.5-turbo-1106',
  'openai/gpt-4-0314',
  'openai/gpt-4-1106-preview',
  'openai/gpt-4-32k-0314',
  'openai/gpt-4-32k',
  'openai/gpt-4-vision-preview',
  'openai/gpt-4-turbo-preview',
  'openai/gpt-4',

  'anthropic/claude-1',
  'anthropic/claude-1.2',
  'anthropic/claude-instant-1.0',
  'anthropic/claude-instant-1.1',
  'anthropic/claude-instant-1:beta',
  'anthropic/claude-2.1:beta',
  'anthropic/claude-2.0:beta',
  'anthropic/claude-2:beta',
  'anthropic/claude-instant-1',
  'anthropic/claude-2.1',
  'anthropic/claude-2.0',
  'anthropic/claude-2',

  'google/palm-2-chat-bison-32k',
  'google/palm-2-codechat-bison-32k',
  'google/palm-2-codechat-bison',
  'google/palm-2-chat-bison',

  // moderated endpoints - replace with "self-moderated"
  'anthropic/claude-3-haiku',
  'anthropic/claude-3-opus',
  'anthropic/claude-3-sonnet',
  'anthropic/claude-3.5-sonnet',
]
