import { asyncMap, pick } from 'convex-helpers'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { generateId } from '../lib/utils'
import { imagesFieldsV1, imagesMetadataFields } from '../schema'
import { getUserIsViewer } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx, RunConfigTextToImage } from '../types'

export const getGeneration = async (ctx: QueryCtx, generationId: Id<'generations_v1'>) => {
  const generation = await ctx.table('generations_v1').get(generationId)
  if (!generation) return null
  return pick(generation, [
    '_id',
    'input',
    'status',
    'updatedAt',
    '_creationTime',
    'messageId',
    'threadId',
  ])
}

export const getImageEnt = async (ctx: QueryCtx, imageId: string) => {
  const _id = ctx.unsafeDb.normalizeId('images_v1', imageId)
  const image = _id
    ? await ctx.table('images_v1').get(_id)
    : await ctx.table('images_v1').get('id', imageId)

  return image && !image.deletionTime ? image : null
}

export const getImageWithEdges = async (ctx: QueryCtx, imageId: string) => {
  const image = await getImageEnt(ctx, imageId)
  return image ? await getImageEdges(ctx, image) : null
}

export const getImageEdges = async (ctx: QueryCtx, image: Ent<'images_v1'>) => {
  return {
    ...image.doc(),
    generation: image.generationId ? await getGeneration(ctx, image.generationId) : undefined,
    metadata: await image.edge('image_metadata').map(async (metadata) => metadata.data),
    userIsViewer: getUserIsViewer(ctx, image.ownerId),
  }
}

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await getImageWithEdges(ctx, args.id)
  },
})

export const getDoc = internalQuery({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await getImageEnt(ctx, args.id)
  },
})

export const getUrl = internalQuery({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await getImageEnt(ctx, args.id)
    const url = image ? await ctx.storage.getUrl(image.fileId) : null
    return url
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
        .map(async (image) => await getImageWithEdges(ctx, image._id))
    })

    return images.flat()
  },
})

export const createImage = internalMutation({
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

export const updateImageSearchText = async (ctx: MutationCtx, id: string) => {
  try {
    const image = await getImageWithEdges(ctx, id)
    if (!image) return

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
    } else {
      const generationDataV0 = image.metadata.find((m) => m.type === 'generationData_V0')
      if (generationDataV0) {
        texts.push(generationDataV0.prompt)
      }
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
  } catch (err) {
    console.error(err)
  }
}

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
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getDoc, {
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
