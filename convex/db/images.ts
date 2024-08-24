import { omit, pick } from 'convex-helpers'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'

import { api } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, mutation, query } from '../functions'
import { generateId } from '../lib/utils'
import { imagesFieldsV1 } from '../schema'
import { getUserIsViewer, getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, QueryCtx } from '../types'

export const getGeneration = async (ctx: QueryCtx, generationId: Id<'generations_v1'>) => {
  const generation = await ctx.table('generations_v1').get(generationId)
  if (!generation) return null
  return pick(generation, ['input', 'status', 'updatedAt', '_creationTime'])
}

export const getImageV1Edges = async (ctx: QueryCtx, image: Ent<'images_v1'>) => {
  return {
    ...image.doc(),
    userIsViewer: getUserIsViewer(ctx, image.ownerId),
    url: (await ctx.storage.getUrl(image.fileId)) || '',
    metadata: await image.edge('image_metadata').map(async (metadata) => metadata.data),
    messageId: await image
      .edge('messages')
      .first()
      .then((message) => message?._id),
  }
}

export const getImageV1 = async (ctx: QueryCtx, imageId: string) => {
  const image = await ctx.table('images_v1').getX('id', imageId)
  return await getImageV1Edges(ctx, image)
}

export const getByUid = query({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images').get('uid', args.uid)
    if (!image) return null
    return {
      ...omit(image, ['searchText']),
      userIsViewer: getUserIsViewer(ctx, image.userId),
      user: await getUserPublic(ctx, image.userId),
    }
  },
})

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await getImageV1(ctx, args.id)
  },
})

export const getGenerationImages = query({
  args: {
    generationId: v.id('generations_v1'),
  },
  handler: async (ctx, { generationId }) => {
    const generation = await getGeneration(ctx, generationId)
    if (!generation) {
      return null
    }

    const images = await ctx
      .table('images_v1', 'generationId', (q) => q.eq('generationId', generationId))
      .map(async (image) => getImageV1Edges(ctx, image))
    return {
      data: generation,
      images,
    }
  },
})

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('images_v1').getX('id', args.id).delete()
  },
})

// * http
export const serve = httpAction(async (ctx, request) => {
  const [uid] = parseUrlToUid(request.url)
  const image = uid
    ? await ctx.runQuery(api.db.images.getByUid, {
        uid,
      })
    : null

  if (!image) {
    console.error('not found', uid)
    return new Response('Not Found', { status: 404 })
  }

  if (image.sourceUrl.startsWith('https://fal.media/files/')) {
    return Response.redirect(image.sourceUrl, 307)
  }

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) {
    console.error('unable to get blob for fileId:', image.fileId, uid)
    return new Response('Internal Server Error', { status: 500 })
  }

  const { download } = getQuery(request.url)
  if (download !== undefined) {
    return new Response(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${uid}.${image.format}"`,
      },
    })
  }

  console.log('serve', uid, image.fileId, image.format)

  return new Response(blob)
})

function parseUrlToUid(url: string) {
  const filename = parseFilename(url, { strict: false })
  const [uid, ext] = filename?.split('.') ?? []
  return [uid, ext] as const
}

export const createImageV1 = internalMutation({
  args: {
    ...imagesFieldsV1,
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId, ...args }) => {
    const message = await ctx.table('messages').getX(messageId)

    return await ctx.table('images_v1').insert({
      ...args,
      ownerId: message.userId,
      messages: [messageId],
      threads: [message.threadId],
      id: generateId('i', Date.now()),
    })
  },
})
