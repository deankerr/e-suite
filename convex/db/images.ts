import { asyncMap, omit, pick } from 'convex-helpers'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { generateId } from '../lib/utils'
import { imagesFieldsV1, imagesMetadataFields } from '../schema'
import { getUserIsViewer, getUserPublic } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx, RunConfigTextToImage } from '../types'

export const getGeneration = async (ctx: QueryCtx, generationId: Id<'generations_v1'>) => {
  const generation = await ctx.table('generations_v1').get(generationId)
  if (!generation) return null
  return pick(generation, [
    'input',
    'status',
    'updatedAt',
    '_creationTime',
    'messageId',
    'threadId',
  ])
}

export const getImageV1Edges = async (ctx: QueryCtx, image: Ent<'images_v1'>) => {
  return {
    ...image.doc(),
    userIsViewer: getUserIsViewer(ctx, image.ownerId),
    url: (await ctx.storage.getUrl(image.fileId)) || '',
    metadata: await image.edge('image_metadata').map(async (metadata) => metadata.data),
    generation: image.generationId ? await getGeneration(ctx, image.generationId) : undefined,
  }
}

export const getImageV1 = async (ctx: QueryCtx, imageId: string) => {
  const _id = ctx.unsafeDb.normalizeId('images_v1', imageId)
  const image = _id
    ? await ctx.table('images_v1').getX(_id)
    : await ctx.table('images_v1').getX('id', imageId)
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
    const generation = await ctx.table('generations_v1').get(generationId)
    if (!generation) {
      return []
    }

    // * find other generations with the same messageId
    const generations = await ctx.table('generations_v1', 'messageId', (q) =>
      q.eq('messageId', generation.messageId),
    )
    if (!generations.find((g) => g._id === generationId)) {
      generations.push(generation)
    }

    const images = await asyncMap(generations, async (generation) => {
      return await ctx
        .table('images_v1', 'generationId', (q) => q.eq('generationId', generation._id))
        .map(async (image) => await getImageV1Edges(ctx, image))
    })

    return images.flat()
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

export const getImageFileId = internalQuery({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images_v1').get('id', args.id)
    return image ? image.fileId : null
  },
})

export const getImageDoc = internalQuery({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.table('images_v1').get('id', args.id)
  },
})

// * http
export const serve = httpAction(async (ctx, request) => {
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getImageDoc, {
        id: imageId,
      })
    : null

  if (!image) {
    return new Response('Not Found', { status: 404 })
  }

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) {
    console.error('unable to get blob for fileId:', image.fileId, imageId)
    return new Response('Internal Server Error', { status: 500 })
  }

  const { download } = getQuery(request.url)
  if (download !== undefined) {
    return new Response(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${imageId}.${image.format}"`,
      },
    })
  }

  return new Response(blob)
})

function parseUrlToImageId(url: string) {
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

    const id = generateId('i', Date.now())
    await ctx.table('images_v1').insert({
      ...args,
      ownerId: message.userId,
      messages: [messageId],
      threads: [message.threadId],
      id,
    })

    await ctx.scheduler.runAfter(0, internal.action.generateImageVisionData.run, { imageId: id })
    return id
  },
})

export const createImageMetadata = internalMutation({
  args: {
    imageId: v.string(),
    data: imagesMetadataFields.data,
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images_v1').getX('id', args.imageId)

    const metadataId = await ctx.table('images_metadata').insert({
      ...args,
      imageId: image._id,
    })

    await updateImageSearchText(ctx, args.imageId)
    return metadataId
  },
})

const updateImageSearchText = async (ctx: MutationCtx, id: string) => {
  const image = await getImageV1(ctx, id)

  const texts: string[] = []

  const captionV1 = image.metadata.find((m) => m.type === 'captionOCR_V1')
  if (captionV1) {
    texts.push(captionV1.title)
    texts.push(captionV1.description)
    texts.push(captionV1.ocr_texts.join(' '))
  } else {
    const captionV0 = image.metadata.find((m) => m.type === 'captionOCR_V0')
    if (captionV0) {
      texts.push(captionV0.captionTitle)
      texts.push(captionV0.captionDescription)
      texts.push(captionV0.captionOCR)
    }
  }

  if (image.generation?.input) {
    const input = image.generation.input as RunConfigTextToImage
    texts.push(input.prompt ?? '')
  }

  const existing = await ctx.table('images_search_text').get('imageId', image._id)
  if (existing) {
    if (texts.length > 0) {
      return await existing.replace({
        imageId: image._id,
        text: texts.join('\n'),
      })
    } else {
      return await existing.delete()
    }
  }

  await ctx.table('images_search_text').insert({
    imageId: image._id,
    text: texts.join('\n'),
  })
}
