import { z } from 'zod'

import * as Fal from '../endpoints/fal'
import * as OpenAi from '../endpoints/openai'
import * as OpenRouter from '../endpoints/openrouter'
import * as Sinkin from '../endpoints/sinkin'
import * as Together from '../endpoints/together'
import { internalAction, internalMutation } from '../functions'
import { chatModelFields, endpointDataCacheFields, imageModelFields } from '../schema'

//* chat models
const chatModelSchema = z.object(chatModelFields)
export type ParsedChatModelData = z.infer<typeof chatModelSchema>

export const importEndpointChatModelData = internalMutation({
  args: {
    purgeExisting: z.boolean(),
    replaceExisting: z.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.purgeExisting) {
      await ctx.table('chat_models').map(async (model) => await model.delete())
      console.log('purged existing chat models')
    }

    const existingModels = await ctx.table('chat_models')
    console.log('chat models existing:', existingModels.length)

    const parsedModels = [
      OpenAi.getNormalizedModelData(),
      await OpenRouter.getNormalizedModelData(ctx),
      await Together.getNormalizedModelData(ctx),
    ]
      .flat()
      .map((data): ParsedChatModelData => {
        const { tags, score } = getDefaultChatModelTags(data)
        return {
          ...data,
          resourceKey: data.resourceKey.toLowerCase(),
          tags,
          internalScore: score + getEndpointScore(data.endpoint),
        }
      })

    for (const data of parsedModels) {
      const existing = existingModels.find((model) => model.resourceKey === data.resourceKey)
      if (existing) {
        if (args.replaceExisting) {
          console.log('replace:', data.resourceKey)
          await existing.replace(data)
        }
        continue
      }

      console.log('create:', data.resourceKey)
      await ctx.table('chat_models').insert(data)
    }
  },
})

const getDefaultChatModelTags = (data: ParsedChatModelData) => {
  const defaultTags = defaultChatModelTags.filter((tag) =>
    tag.includes.some((tag) => data.endpointModelId.includes(tag)),
  )
  return {
    tags: defaultTags.map((tag) => tag.tag),
    score: defaultTags.map((tag) => tag.score).reduce((a, b) => a + b, 0),
  }
}

const getEndpointScore = (endpoint: string) => endpointScores[endpoint] ?? 0

const endpointScores: Record<string, number> = {
  openai: 2,
  together: 1,
  openrouter: 0,
}

const defaultChatModelTags = [
  {
    tag: 'flagship',
    includes: [
      'gpt-4o',
      'opus',
      'sonnet',
      'haiku',
      'command',
      'gemini',
      'llama-3',
      'mixtral',
      'mistral',
      'qwen-2',
    ],
    score: 10,
  },
  { tag: 'multimodal', includes: ['gpt-4o', 'vision', 'llava', 'gemini'], score: 5 },

  { tag: 'online', includes: ['online'], score: 1 },
  { tag: 'free', includes: ['free'], score: -1 },
  { tag: 'code', includes: ['code'], score: -1 },
  {
    tag: 'roleplay',
    includes: [
      'mytho',
      'lumimaid',
      'noromaid',
      'psyfighter',
      'slerp',
      'lzlv',
      'fimbulvetr',
      'rose',
      'toppy',
      'weaver',
    ],
    score: -1,
  },
  { tag: 'legacy', includes: ['gpt-3.5', 'palm-2', 'claude-2', 'claude-instant'], score: -10 },
  { tag: 'vintage', includes: ['alpaca', 'vicuna'], score: -10 },
  { tag: 'expensive', includes: ['gpt-4-32k'], score: -30 },
]

//* image models
const imageModelSchema = z.object(imageModelFields)
export type ImageModelDataRecord = z.infer<typeof imageModelSchema>
export const importEndpointImageModelData = internalMutation({
  args: {
    purgeExisting: z.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.purgeExisting) {
      await ctx.table('image_models').map(async (model) => await model.delete())
      console.log('purged existing image models')
    }

    const existingModels = await ctx.table('image_models')
    console.log('image models existing:', existingModels.length)

    const fal = Fal.getNormalizedModelData()
    const falNew = fal.filter(
      (model) => !existingModels.some((m) => m.resourceKey === model.resourceKey),
    )
    const falIds = await ctx.table('image_models').insertMany(falNew)
    console.log('fal: imported', falIds.length, 'models')

    const sinkin = await Sinkin.getNormalizedModelData(ctx)
    const sinkinNew = sinkin.filter(
      (model) => !existingModels.some((m) => m.resourceKey === model.resourceKey),
    )
    const sinkinIds = await ctx.table('image_models').insertMany(sinkinNew)
    console.log('sinkin: imported', sinkinIds.length, 'models')
  },
})

export const fetchEndpointModelData = internalAction(async (ctx) => {
  await OpenRouter.fetchModelData(ctx)
  await Sinkin.fetchModelData(ctx)
  await Together.fetchModelData(ctx)
})

export const cacheEndpointModelData = internalMutation({
  args: endpointDataCacheFields,
  handler: async (ctx, args) => {
    return await ctx.table('endpoint_data_cache').insert(args)
  },
})
