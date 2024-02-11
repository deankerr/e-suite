import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { internal } from './_generated/api'
import { dimensions } from './constants'
import { mutation, query } from './functions'
import { generationParameters, permissions } from './schema'
import { error, vEnum } from './util'

export const get = query({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('generations')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .getX(args.id)
  },
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('generations')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .order('desc')
      .paginate(args.paginationOpts)
  },
})

export const send = mutation({
  args: {
    parameters: generationParameters,
    images: v.array(
      v.object({
        dimensions: vEnum(dimensions),
      }),
    ),
    permissions: v.optional(permissions),
  },
  handler: async (ctx, args) => {
    //TODO validation

    const imageIds = await Promise.all(
      args.images.map(async ({ dimensions }) => {
        const { width, height } = getDimensionSizes(dimensions)
        const id = await ctx.table('images').insert({
          width,
          height,
          nsfw: 'unknown',
          blurDataURL: '',
          color: '',
          metadata: {},
          parameters: args.parameters,
          permissions: args.permissions ?? { private: true },
        })
        await ctx.scheduler.runAfter(0, internal.jobs.dispatch, { type: 'generation', ref: id })
        return id
      }),
    )

    const id = await ctx.table('generations').insert({
      authorId: ctx.viewerIdX(),
      imageIds,
      permissions: args.permissions ?? { private: true },
    })

    return id
  },
})

const getDimensionSizes = (value: (typeof dimensions)[number]) => {
  const sizes = {
    portrait: { width: 512, height: 768 },
    square: { width: 512, height: 512 },
    landscape: { width: 768, height: 512 },
  }
  if (value in sizes) return sizes[value]
  throw error('Invalid generation dimension', { dimension: value })
}
