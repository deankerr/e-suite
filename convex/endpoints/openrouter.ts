import { omit } from 'convex-helpers'
import ky from 'ky'
import * as vb from 'valibot'

import { api, internal } from '../_generated/api'
import { shapeChatModel } from '../db/models'
import { internalAction } from '../functions'

import type { ActionCtx } from '../_generated/server'

const endpoint = 'openrouter'

const excludedModelIds = [
  'meta-llama/llama-guard-2-8b',
  'openrouter/auto',
  'openrouter/flavor-of-the-week',
  'openai/gpt-3.5-turbo-0125',
  'openai/gpt-3.5-turbo-0301',
  'openai/gpt-3.5-turbo-0613',
  'openai/gpt-3.5-turbo-1106',
  'openai/gpt-4-0314',
  'openai/gpt-4-1106-preview',
  'openai/gpt-4-32k-0314',
  'openai/gpt-4-32k',
  'openai/gpt-4o-2024-05-13',
  'anthropic/claude-1',
  'anthropic/claude-1.2',
  'anthropic/claude-instant-1.0',
  'anthropic/claude-instant-1.1',
]

const ApiModelRecord = vb.object({
  id: vb.string(),
  name: vb.string(),
  description: vb.string(),
  pricing: vb.object({
    prompt: vb.string(),
    completion: vb.string(),
    image: vb.string(),
    request: vb.string(),
  }),
  context_length: vb.number(),
  architecture: vb.object({
    modality: vb.string(),
    tokenizer: vb.string(),
    instruct_type: vb.nullable(vb.string()),
  }),
  top_provider: vb.object({
    max_completion_tokens: vb.number(),
    is_moderated: vb.boolean(),
  }),
  per_request_limits: vb.null(),
})

const ApiModelsResponse = vb.object({
  data: vb.array(vb.unknown()),
})

const processModelRecords = async (ctx: ActionCtx, records: unknown[]) => {
  const existingModels = await ctx.runQuery(api.db.models.listChatModels, { endpoint })
  const availabilityCheck = new Set(existingModels.map((m) => m.resourceKey))
  console.info(endpoint, 'existing models', existingModels.length)

  for (const record of records) {
    try {
      const parsed = vb.parse(ApiModelRecord, record)
      // * excluded model skip
      if (excludedModelIds.includes(parsed.id)) continue

      // * build model shape
      const pricing =
        parsed.id.endsWith(':free') || Object.values(parsed.pricing).every((value) => value === '0')
          ? { type: 'free' }
          : {
              type: 'llm',
              tokenInput: toPerMillionTokens(parsed.pricing.prompt),
              tokenOutput: toPerMillionTokens(parsed.pricing.completion),
              imageInput:
                parsed.pricing.image && parsed.pricing.image !== '0'
                  ? parseFloat(parsed.pricing.image)
                  : undefined,
              imageOutput:
                parsed.pricing.request && parsed.pricing.request !== '0'
                  ? parseFloat(parsed.pricing.request)
                  : undefined,
            }

      const shape = shapeChatModel({
        endpoint,
        name: parsed.name,
        description: parsed.description,
        creatorName: parsed.id.split('/')[0] ?? '',
        link: '',
        license: '',
        tags: [],
        modelId: parsed.id,
        endpointModelId: parsed.id,
        pricing,
        moderated: parsed.top_provider.is_moderated,
        available: true,
        hidden: false,
        internalScore: 0,
        contextLength: parsed.context_length,
        tokenizer: parsed.architecture.tokenizer,
      })

      // * compare with any existing
      const existing = existingModels.find((m) => m.resourceKey === shape.resourceKey)
      if (existing) {
        await ctx.runMutation(internal.db.models.updateChatModel, {
          id: existing._id,
          ...shape,
        })
        if (!existing.available) {
          console.warn(endpoint, 'model now available', shape.name, shape.resourceKey)
        }
      } else {
        await ctx.runMutation(internal.db.models.createChatModel, shape)
        console.info(endpoint, 'created new model', shape.name, shape.resourceKey)
      }

      availabilityCheck.delete(shape.resourceKey)
    } catch (err) {
      if (vb.isValiError(err)) {
        console.error(endpoint, vb.flatten(err.issues))
      } else {
        console.error(endpoint, err)
      }
    }
  }

  // * mark unavailable models
  const unavailable = existingModels.filter((m) => availabilityCheck.has(m.resourceKey))
  for (const model of unavailable) {
    const args = omit(model, ['_id', '_creationTime'])
    await ctx.runMutation(internal.db.models.updateChatModel, {
      id: model._id,
      ...args,
      available: false,
    })
    console.warn(endpoint, 'model now unavailable', model.name, model.resourceKey)
  }
}

export const importModels = internalAction(async (ctx: ActionCtx) => {
  console.info(endpoint, 'importing models')
  console.log('https://openrouter.ai/api/v1/models')
  const response = await ky.get('https://openrouter.ai/api/v1/models').json()
  const records = vb.parse(ApiModelsResponse, response)

  await processModelRecords(ctx, records.data)
})

function toPerMillionTokens(value: string): number {
  const perToken = parseFloat(value)
  const perMillionTokens = perToken * 1000000
  return Math.round(perMillionTokens * 10000) / 10000 // Round to 4 decimal places
}
