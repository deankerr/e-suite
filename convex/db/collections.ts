import { ConvexError, v } from 'convex/values'

import { mutation, query } from '../functions'
import { generateSlugId } from '../lib/utils'
import { getImageV2Edges } from './images'

import type { Ent, QueryCtx } from '../types'

export const getCollection = async (ctx: QueryCtx, collectionId: string) => {
  const _id = ctx.table('collections').normalizeId(collectionId)
  return _id
    ? await ctx.table('collections').get(_id)
    : await ctx.table('collections').get('id', collectionId)
}

export const getCollectionEdges = async (ctx: QueryCtx, collection: Ent<'collections'>) => {
  return {
    ...collection.doc(),
    images: await collection.edge('images_v2').map(async (image) => getImageV2Edges(ctx, image)),
  }
}

export const get = query({
  args: {
    collectionId: v.string(),
  },
  handler: async (ctx, { collectionId }) => {
    const collection = await getCollection(ctx, collectionId)
    return collection ? await getCollectionEdges(ctx, collection) : null
  },
})

export const latest = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewerX()

    return await ctx
      .table('collections', 'ownerId', (q) => q.eq('ownerId', viewer._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(50)
      .map(async (collection) => await getCollectionEdges(ctx, collection))
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    imageIds: v.optional(v.array(v.id('images_v2'))),
  },
  handler: async (ctx, { title, imageIds }) => {
    const viewer = await ctx.viewerX()

    const collectionId = await ctx.table('collections').insert({
      title,
      ownerId: viewer._id,
      id: generateSlugId(),
      images_v2: imageIds,
    })

    return collectionId
  },
})

export const update = mutation({
  args: {
    collectionId: v.string(),
    title: v.optional(v.string()),
    images_v2: v.optional(
      v.object({
        add: v.optional(v.array(v.id('images_v2'))),
        remove: v.optional(v.array(v.id('images_v2'))),
      }),
    ),
  },
  handler: async (ctx, { collectionId, ...fields }) => {
    const collection = await getCollection(ctx, collectionId)
    if (!collection) {
      throw new ConvexError('Collection not found')
    }
    return await ctx.table('collections').getX(collection._id).patch(fields)
  },
})

export const remove = mutation({
  args: {
    collectionId: v.string(),
  },
  handler: async (ctx, { collectionId }) => {
    const collection = await getCollection(ctx, collectionId)
    if (!collection) {
      throw new ConvexError('Collection not found')
    }
    return await ctx.table('collections').getX(collection._id).delete()
  },
})
