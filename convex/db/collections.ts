import { nullable } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'

import { mutation, query } from '../functions'
import { emptyPage, generateSlugId, paginatedReturnFields } from '../lib/utils'
import { getImageV2Edges, imagesReturn } from './images'

import type { Ent, QueryCtx } from '../types'

const collectionReturnFields = v.object({
  _id: v.id('collections'),
  _creationTime: v.number(),
  id: v.string(),
  title: v.string(),
  ownerId: v.id('users'),

  images: v.array(imagesReturn),
})

export const getCollection = async (ctx: QueryCtx, collectionId: string) => {
  const _id = ctx.table('collections').normalizeId(collectionId)
  return _id
    ? await ctx.table('collections').get(_id)
    : await ctx.table('collections').get('id', collectionId)
}

export const getCollectionEdges = async (ctx: QueryCtx, collection: Ent<'collections'>) => {
  return {
    ...collection.doc(),
    images: await collection
      .edge('images_v2')
      .order('desc')
      .take(24)
      .map(async (image) => getImageV2Edges(ctx, image)),
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
  returns: v.union(collectionReturnFields, v.null()),
})

export const latest = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await ctx.viewer()
    if (!viewer) return null

    return await ctx
      .table('collections', 'ownerId', (q) => q.eq('ownerId', viewer._id))
      .order('desc')
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(24)
      .map(async (collection) => await getCollectionEdges(ctx, collection))
  },
  returns: nullable(v.array(collectionReturnFields)),
})

export const listImages = query({
  args: {
    collectionId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { collectionId, paginationOpts }) => {
    const collection = await getCollection(ctx, collectionId)
    if (!collection) return emptyPage()

    return await collection
      .edge('images_v2')
      .order('desc')
      .paginate(paginationOpts)
      .map(async (image) => getImageV2Edges(ctx, image))
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(imagesReturn) }),
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
