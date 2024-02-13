import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { Id } from '../_generated/dataModel'
import { mutation, query } from '../functions'
import { imageModelFields } from '../schema'
import { Ent } from '../types'

export type ImageModel = Awaited<ReturnType<typeof get>>

export const get = query({
  args: {
    id: v.id('imageModels'),
  },
  handler: async (ctx, { id }) => {
    const imageModel = await ctx.table('imageModels').getX(id)
    const image = await ctx.table('images').get(imageModel.imageId)

    return {
      ...imageModel,
      image,
    }
  },
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const results = await ctx.table('imageModels').order('desc', 'order').paginate(paginationOpts)

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (imageModel) => ({
          ...imageModel,
          image: await ctx.table('images').get(imageModel.imageId),
        })),
      ),
    }
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
