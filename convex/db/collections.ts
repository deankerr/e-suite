import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { mutation, query } from '../functions'
import { generateSlugId } from '../lib/utils'
import { getImageV2Edges } from './images'

export const get = query({
  args: {
    collectionId: v.id('collections'),
  },
  handler: async (ctx, { collectionId }) => {
    return await ctx
      .table('collections')
      .getX(collectionId)
      .then(async (collection) => ({
        ...collection,
        images: await collection
          .edge('images_v2')
          .map(async (image) => getImageV2Edges(ctx, image)),
      }))
  },
})

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx
      .table('collections')
      .paginate(paginationOpts)
      .map(async (collection) => ({
        ...collection,
        images: await collection
          .edge('images_v2')
          .map(async (image) => getImageV2Edges(ctx, image)),
      }))
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
    collectionId: v.id('collections'),
    title: v.optional(v.string()),
    images_v2: v.optional(
      v.object({
        add: v.optional(v.array(v.id('images_v2'))),
        remove: v.optional(v.array(v.id('images_v2'))),
      }),
    ),
  },
  handler: async (ctx, { collectionId, ...fields }) => {
    return await ctx.table('collections').getX(collectionId).patch(fields)
  },
})
