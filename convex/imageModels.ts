import { defineTable, paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { Doc } from './_generated/dataModel'
import { internalMutation, mutation, query, QueryCtx } from './_generated/server'
import { modelBases, modelTypes, nsfwRatings } from './constants'
import { raise, vEnum } from './util'

const imageModelFields = {
  name: v.string(),
  description: v.string(),
  base: vEnum(modelBases),
  type: vEnum(modelTypes),
  nsfw: vEnum(nsfwRatings),
  imageId: v.id('images'),
  tags: v.array(v.string()),

  civitaiId: v.optional(v.string()),
  huggingFaceId: v.optional(v.string()),

  sinkin: v.optional(
    v.object({
      refId: v.string(),
      hidden: v.optional(v.boolean()),
    }),
  ),

  order: v.number(),
  hidden: v.optional(v.boolean()),
}

export const imageModelTable = defineTable(imageModelFields).index('by_order', ['order'])

const withImages = async (
  ctx: QueryCtx,
  { imageModels }: { imageModels: Doc<'imageModels'>[] },
) => {
  return await Promise.all(
    imageModels.map(async (imageModel) => {
      return {
        imageModel,
        image: await ctx.db.get(imageModel.imageId),
      }
    }),
  )
}

export const get = query({
  args: {
    id: v.id('imageModels'),
  },
  handler: async (ctx, { id }) => {
    const imageModel = await ctx.db.get(id)
    if (imageModel) {
      return {
        imageModel,
        image: await ctx.db.get(imageModel.imageId),
      }
    }

    return null
  },
})

export const list = query({
  args: {
    take: v.optional(v.number()),
    type: v.optional(vEnum(modelTypes)),
  },
  handler: async (ctx, { take, type }) => {
    const models = await ctx.db
      .query('imageModels')
      .filter((q) => {
        if (!type) return true
        return q.eq(q.field('type'), type)
      })
      .take(take ?? 100)

    return await withImages(ctx, { imageModels: models })
  },
})

export const page = query({
  args: {
    paginationOpts: paginationOptsValidator,
    type: v.optional(vEnum(modelTypes)),
  },
  handler: async (ctx, args) => {
    const pageResult = await ctx.db
      .query('imageModels')
      .filter((q) => {
        if (!args.type) return true
        return q.eq(q.field('type'), args.type)
      })
      .paginate(args.paginationOpts)

    const modelsWithImages = await withImages(ctx, { imageModels: pageResult.page })
    return { ...pageResult, page: modelsWithImages }
  },
})

export const create = mutation({
  args: {
    fields: v.object(imageModelFields),
  },
  handler: async (ctx, { fields }) => {
    const id = await ctx.db.insert('imageModels', fields)
    return id
  },
})

export const update = mutation(async (ctx, { fields }: { fields: Partial<Doc<'imageModels'>> }) => {
  await ctx.db.patch(fields._id ?? raise('imageModel update missing _id'), fields)
})

export const migOrder = internalMutation(async (ctx) => {
  const ims = await ctx.db.query("imageModels").collect()

  for (const im of ims) {
    let cout = 0
    
    if (im.tags.includes('realistic')) cout += 5
    if (im.tags.includes('_cartoon')) cout += 2
    if (im.tags.includes('_hot')) cout += 5

    const order = Math.min(Math.max(0, cout), 10)

    await ctx.db.patch(im._id, {order})
    console.log(im.name, order)
  }
})