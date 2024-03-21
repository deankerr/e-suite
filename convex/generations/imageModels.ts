import { v } from 'convex/values'
import { Id } from '../_generated/dataModel'
import { mutation, query } from '../functions'
import { imageModelFields } from '../schema'
import { Ent, QueryCtx } from '../types'

export type ImageModel = Awaited<ReturnType<typeof get>>

export const getImageModel = async (ctx: QueryCtx, id: Id<'imageModels'>) => {
  const imageModel = await ctx.table('imageModels').getX(id)
  return {
    ...imageModel,
    image: await ctx.table('images').get(imageModel.imageId),
  }
}

export const get = query({
  args: {
    id: v.id('imageModels'),
  },
  handler: async (ctx, { id }) => await getImageModel(ctx, id),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx
      .table('imageModels', 'order')
      .order('desc')
      .map(async (imageModel) => ({
        ...imageModel,
        image: await ctx.table('images').get(imageModel.imageId),
      }))
  },
})

export const create = mutation({
  args: {
    fields: v.object(imageModelFields),
  },
  handler: async (ctx, { fields }) => {
    const id = await ctx.table('imageModels').insert({ ...fields, order: 0 })
    return id
  },
})

export const update = mutation(
  async (ctx, { id, fields }: { id: Id<'imageModels'>; fields: Partial<Ent<'imageModels'>> }) => {
    await ctx.table('imageModels').getX(id).patch(fields)
  },
)
