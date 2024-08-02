import { Infer, v } from 'convex/values'

import * as Sinkin from '../endpoints/sinkin'
import { internalAction, internalMutation } from '../functions'
import { imageModelFields } from '../schema'

//* image models
const imageModelSchema = v.object(imageModelFields)
export type ImageModelDataRecord = Infer<typeof imageModelSchema> & { resourceKey: string }
export const importEndpointImageModelData = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const existingModels = await ctx.table('image_models')
    console.log('image models existing:', existingModels.length)

    const sinkin = await Sinkin.getNormalizedModelData(ctx)
    const sinkinNew = sinkin.filter(
      (model) => !existingModels.some((m) => m.resourceKey === model.resourceKey),
    )
    const sinkinIds = await ctx.table('image_models').insertMany(sinkinNew)
    console.log('sinkin: imported', sinkinIds.length, 'models')
  },
})

export const fetchEndpointModelData = internalAction(async (ctx) => {
  await Sinkin.fetchModelData(ctx)
})

export const cacheEndpointModelData = internalMutation({
  args: { endpoint: v.string(), name: v.string(), data: v.string() },
  handler: async (ctx, args) => {
    return await ctx.table('endpoint_data_cache').insert(args)
  },
})
