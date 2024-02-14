import { v } from 'convex/values'
import { internal } from '../_generated/api'
import { Id } from '../_generated/dataModel'
import { internalMutation, internalQuery } from '../functions'
import { QueryCtx } from '../types'
import { assert } from '../util'

export type StoredImage = Awaited<ReturnType<typeof getImage>>

export const getImage = async (ctx: QueryCtx, id: Id<'images'>) => {
  const image = await ctx.table('images').getX(id)
  assert(!image.deletionTime, 'Image was deleted')

  const job = await ctx
    .table('jobs')
    .order('desc', 'imageId')
    .filter((q) => q.eq(q.field('imageId'), image._id))
    .first()

  return {
    ...image,
    job,
  }
}

export const getImages = async (ctx: QueryCtx, ids: Id<'images'>[]): Promise<StoredImage[]> => {
  return await ctx
    .table('images')
    .getManyX(ids)
    .map(async (image) => {
      assert(!image.deletionTime, 'Image was deleted')
      return {
        ...image,
        job: await ctx
          .table('jobs')
          .order('desc', 'imageId')
          .filter((q) => q.eq(q.field('imageId'), image._id))
          .first(),
      }
    })
}

export const get = internalQuery({
  args: {
    id: v.id('images'),
  },
  handler: async (ctx, { id }) => await getImage(ctx, id),
})

export const addSourceUrl = internalMutation({
  args: {
    id: v.id('images'),
    sourceUrl: v.string(),
  },
  handler: async (ctx, { id, sourceUrl }) => {
    const image = await ctx.table('images').getX(id)
    assert(!image.sourceUrl, 'Image already has a source url')

    await image.patch({ sourceUrl })
    await ctx.scheduler.runAfter(0, internal.files.process.downloadImage, {
      imageId: id,
      sourceUrl,
    })
  },
})

export const addStorageResults = internalMutation({
  args: {
    id: v.id('images'),
    storageId: v.id('_storage'),
    width: v.number(),
    height: v.number(),
    blurDataURL: v.string(),
    color: v.string(),
    metadata: v.any(),
  },
  handler: async (ctx, { id, ...results }) => await ctx.table('images').getX(id).patch(results),
})
