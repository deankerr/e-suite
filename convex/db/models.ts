import { z } from 'zod'

import * as Fal from '../endpoints/fal'
import * as OpenAi from '../endpoints/openai'
import * as OpenRouter from '../endpoints/openrouter'
import * as Sinkin from '../endpoints/sinkin'
import * as Together from '../endpoints/together'
import { internalAction, internalMutation } from '../functions'
import { chatModelFields, endpointDataCacheFields, imageModelFields } from '../schema'

//* endpoint model data management
const chatModelSchema = z.object(chatModelFields)
export type ChatModelDataRecord = z.infer<typeof chatModelSchema>
const imageModelSchema = z.object(imageModelFields)
export type ImageModelDataRecord = z.infer<typeof imageModelSchema>

export const importEndpointChatModelData = internalMutation({
  args: {
    purgeExisting: z.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.purgeExisting) {
      await ctx.table('chat_models').map(async (model) => await model.delete())
    }

    const existingModels = await ctx.table('chat_models')
    console.log('chat models existing:', existingModels.length)

    const openai = OpenAi.getNormalizedModelData()
    const openaiNew = openai.filter((model) => !existingModels.some((m) => m.slug === model.slug))
    const openaiIds = await ctx.table('chat_models').insertMany(openaiNew)
    console.log('openai: imported', openaiIds.length, 'models')

    const or = await OpenRouter.getNormalizedModelData(ctx)
    const orNew = or.filter((model) => !existingModels.some((m) => m.slug === model.slug))
    const orIds = await ctx.table('chat_models').insertMany(orNew)
    console.log('openrouter: imported', orIds.length, 'models')

    const together = await Together.getNormalizedModelData(ctx)
    const togetherNew = together.filter(
      (model) => !existingModels.some((m) => m.slug === model.slug),
    )
    const togetherIds = await ctx.table('chat_models').insertMany(togetherNew)
    console.log('together: imported', togetherIds.length, 'models')
  },
})

export const importEndpointImageModelData = internalMutation({
  args: {
    purgeExisting: z.boolean(),
  },
  handler: async (ctx, args) => {
    if (args.purgeExisting) {
      await ctx.table('image_models').map(async (model) => await model.delete())
    }

    const existingModels = await ctx.table('image_models')
    console.log('image models existing:', existingModels.length)

    const fal = Fal.getNormalizedModelData()
    const falNew = fal.filter((model) => !existingModels.some((m) => m.slug === model.slug))
    const falIds = await ctx.table('image_models').insertMany(falNew)
    console.log('fal: imported', falIds.length, 'models')

    const sinkin = await Sinkin.getNormalizedModelData(ctx)
    const sinkinNew = sinkin.filter((model) => !existingModels.some((m) => m.slug === model.slug))
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
