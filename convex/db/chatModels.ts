import { omit } from 'convex-helpers'
import ky from 'ky'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { openaiChatModelData } from '../endpoints/openai'
import { internalAction, internalMutation, query } from '../functions'
import { chatModelFields, endpointDataCacheFields } from '../schema'
import { insist } from '../shared/utils'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('chatModels')
    return models.sort((a, b) => a.slug.localeCompare(b.slug))
  },
})

export const getLatestCacheData = query({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.table('endpointDataCache').order('desc')
    const openrouter = data.find((d) => d.endpoint === 'openrouter')
    const together = data.find((d) => d.endpoint === 'together')
    return { openrouter, together }
  },
})

export const createCacheData = internalMutation({
  args: endpointDataCacheFields,
  handler: async (ctx, args) => {
    return await ctx.table('endpointDataCache').insert(args)
  },
})

export const fetchTogetherModels = internalAction(async (ctx) => {
  console.log('https://api.together.xyz/models/info')
  const response = await ky
    .get('https://api.together.xyz/models/info', {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
    })
    .json()

  await ctx.runMutation(internal.db.chatModels.createCacheData, {
    endpoint: 'together',
    name: 'chat-models',
    data: JSON.stringify(response, null, 2),
  })
})

export const fetchOpenRouterModels = internalAction(async (ctx) => {
  console.log('https://openrouter.ai/api/v1/models')
  const response = await ky.get('https://openrouter.ai/api/v1/models').json()
  await ctx.runMutation(internal.db.chatModels.createCacheData, {
    endpoint: 'openrouter',
    name: 'chat-models',
    data: JSON.stringify(response, null, 2),
  })
})

export const importOpenAiModelData = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const model of openaiChatModelData) {
      await ctx.table('chatModels').insert(model)
    }
  },
})

export const importTogetherModelData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const togetherData = await ctx
      .table('endpointDataCache')
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('endpoint'), 'together'), q.eq(q.field('name'), 'chat-models')),
      )
      .first()
    if (!togetherData) return
    const parsed = parseTogetherData(togetherData.data)
    for (const m of parsed) {
      await ctx.table('chatModels').insert(m)
      console.log('created', m.slug)
    }
  },
})

export const importOpenRouterModelData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const orData = await ctx
      .table('endpointDataCache')
      .order('desc')
      .filter((q) =>
        q.and(q.eq(q.field('endpoint'), 'openrouter'), q.eq(q.field('name'), 'chat-models')),
      )
      .first()
    insist(orData, 'no openrouter data')

    const parsed = parseOpenRouterData(orData.data)
    for (const m of parsed) {
      await ctx.table('chatModels').insert(m)
      console.log('created', m.slug)
    }
  },
})

const chatModelSchema = z.object(chatModelFields)

function parseTogetherData(data: string) {
  const json = JSON.parse(data) as Record<string, any>[]
  const filtered = json
    .map((d) => omit(d, ['modelInstanceConfig', 'instances', 'depth']))
    .filter((d) => d.display_type === 'chat' && d.isFeaturedModel)

  const parsed = filtered
    .map((d) =>
      chatModelSchema.parse({
        slug: d.name,
        name: d.display_name,
        description: d.description,
        creatorName: d.create_organization ?? '',

        link: d.link,
        license: d.license,
        tags: [],

        numParameters: Number(d.num_parameters),
        contextLength: d.context_length,
        tokenizer: '',
        stop: d.config?.stop ?? [],

        endpoints: [
          {
            endpoint: 'together',
            model: d.name,
            pricing: {},
            modelDataSource: JSON.stringify(d, null, 2),
          },
        ],
      }),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return parsed
}

function parseOpenRouterData(data: string) {
  const filterIds = ['openrouter/auto', 'openai/gpt-4o-2024-05-13']
  const json = JSON.parse(data).data as Record<string, any>[]
  const filtered = json.filter((d) => !filterIds.includes(d.id) && !d.name.includes('(older v'))

  const parsed = filtered
    .map((d) =>
      chatModelSchema.parse({
        slug: d.id,
        name: d.name,
        description: d.description,

        creatorName: '',
        link: '',
        license: '',
        tags: [],

        numParameters: -1,
        contextLength: d.context_length,
        tokenizer: d.architecture.tokenizer,
        stop: [],

        endpoints: [
          {
            endpoint: 'openrouter',
            model: d.id,
            pricing: {},
            modelDataSource: JSON.stringify(d, null, 2),
          },
        ],
      }),
    )
    .sort((a, b) => a.slug.localeCompare(b.slug))

  return parsed
}
