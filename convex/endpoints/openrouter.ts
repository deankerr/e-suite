import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'

import type { ActionCtx } from '../_generated/server'
import type { ChatModelDataRecord } from '../db/models'
import type { MutationCtx } from '../types'

export const fetchModelData = async (ctx: ActionCtx) => {
  console.log('https://openrouter.ai/api/v1/models')
  const response = await ky.get('https://openrouter.ai/api/v1/models').json()
  await ctx.runMutation(internal.db.models.cacheEndpointModelData, {
    endpoint: 'openrouter',
    name: 'chat-models',
    data: JSON.stringify(response, null, 2),
  })
}

export const getNormalizedModelData = async (ctx: MutationCtx) => {
  const cached = await ctx
    .table('endpoint_data_cache')
    .order('desc')
    .filter((q) =>
      q.and(q.eq(q.field('endpoint'), 'openrouter'), q.eq(q.field('name'), 'chat-models')),
    )
    .firstX()
  const list = modelDataListSchema.parse(JSON.parse(cached.data))

  const models = list.data
    .map((raw): ChatModelDataRecord | null => {
      const parsed = modelDataRecordSchema.strict().safeParse(raw)
      if (!parsed.success) {
        console.error(parsed.error.issues)
        return null
      }
      if (filteredModelIds.includes(parsed.data.id)) return null

      const d = parsed.data
      return {
        slug: `openrouter::${d.id}`,
        name: d.name,
        description: d.description,

        creatorName: d.id.split('/')[0] ?? '',
        link: '',
        license: '',
        tags: [],

        numParameters: 0,
        contextLength: d.context_length,
        tokenizer: d.architecture.tokenizer,
        stop: [],
        maxOutputTokens: d.top_provider.max_completion_tokens ?? undefined,

        endpoint: 'openrouter',
        model: d.id,
        pricing: {},
        moderated: d.top_provider.is_moderated,
        available: true,
        hidden: false,
      }
    })
    .filter(Boolean) as ChatModelDataRecord[]

  console.log('openrouter: processed', models.length, 'models')
  return models
}

const modelDataListSchema = z.object({
  data: z.unknown().array(),
})

const modelDataRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  pricing: z.object({
    prompt: z.coerce.number(),
    completion: z.coerce.number(),
    image: z.coerce.number(),
    request: z.coerce.number(),
  }),
  context_length: z.number(),
  architecture: z.object({
    modality: z.string(),
    tokenizer: z.string(),
    instruct_type: z.string().nullable(),
  }),
  top_provider: z.object({
    max_completion_tokens: z.number().nullable(),
    is_moderated: z.boolean(),
  }),
  per_request_limits: z.null(),
})

const filteredModelIds = [
  'meta-llama/llama-guard-2-8b',
  'openrouter/auto',
  'openai/gpt-4o-2024-05-13',
  'openai/gpt-3.5-turbo-0613',
  'anthropic/claude-instant-1.1',
  'openai/gpt-3.5-turbo-1106',
  'openai/gpt-4-1106-preview',
  'openai/gpt-4-32k-0314',
  'anthropic/claude-1',
  'anthropic/claude-1.2',
  'anthropic/claude-instant-1.0',
  'openai/gpt-3.5-turbo-0301',
  'openai/gpt-4-0314',
]
