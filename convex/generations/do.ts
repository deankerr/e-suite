import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { getImages } from '../files/images'
import { mutation, query } from '../functions'
import { generationParameters, permissions } from '../schema'
import { QueryCtx } from '../types'
import { getUser } from '../users'
import { assert, error } from '../util'

export type Generation = Awaited<ReturnType<typeof getGeneration>>

export const getGeneration = async (ctx: QueryCtx, id: Id<'generations'>) => {
  const generation = await ctx.table('generations').getX(id)
  assert(!generation.deletionTime, 'Generation was deleted')
  const images = await getImages(ctx, generation.imageIds)
  const author = await getUser(ctx, generation.authorId)

  return {
    ...generation,
    images,
    author,
  }
}

export const get = query({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, args) => getGeneration(ctx, args.id),
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const results = await ctx
      .table('generations')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .order('desc')
      .paginate(args.paginationOpts)

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (generation) => ({
          ...generation,
          images: await getImages(ctx, generation.imageIds),
          author: await getUser(ctx, generation.authorId),
        })),
      ),
    }
  },
})

export const send = mutation({
  args: {
    parameters: generationParameters,
    images: v.array(
      v.object({
        dimensions: v.string(),
      }),
    ),
    permissions: v.optional(permissions),
  },
  handler: async (ctx, args) => {
    //TODO validation

    const imageIds = await Promise.all(
      args.images.map(async ({ dimensions }, i) => {
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
        await ctx.scheduler.runAfter(i, internal.jobs.dispatch, { type: 'generation', imageId: id })
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

export const remove = mutation({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, { id }) => await ctx.table('generations').getX(id).delete(),
})

const getDimensionSizes = (value: string) => {
  const sizes = {
    portrait: { width: 512, height: 768 },
    square: { width: 512, height: 512 },
    landscape: { width: 768, height: 512 },
  }

  if (value in sizes) return sizes[value as keyof typeof sizes]
  throw error('Invalid generation dimension', { dimension: value })
}
