import { omit, pick } from 'convex-helpers'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { generateTimestampId } from '../lib/utils'
import { imagesMetadataFields, imagesV2Fields } from '../schema'
import { getUserIsViewer } from './users'

import type { Id } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../types'

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

export const getDoc = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await getImageEnt(ctx, args.imageId)
    if (image) return image

    const imageV2 = await getImageV2Ent(ctx, args.imageId)
    return imageV2
  },
})

export const getUrl = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await getImageEnt(ctx, args.imageId)
    const url = image ? await ctx.storage.getUrl(image.fileId) : null
    return url
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
      const input = image.generation.input as any
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
    return await ctx.table('images_v2').getX('id', args.id).delete()
  },
})

// * http
export const serve = httpAction(async (ctx, request) => {
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getDoc, {
        imageId,
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

export const serveUrl = httpAction(async (ctx, request) => {
  const [imageId] = parseUrlToImageId(request.url)
  const image = imageId
    ? await ctx.runQuery(internal.db.images.getDoc, {
        imageId,
      })
    : null

  if (!image) {
    return new Response('Not Found', { status: 404 })
  }

  if (image.sourceUrl.startsWith('https://fal.media/')) {
    return new Response(image.sourceUrl)
  }

  const url = await ctx.storage.getUrl(image.fileId)
  if (!url) {
    throw new Error('Unable to get url for imageId: ' + image.id)
  }

  return new Response(url)
})

function parseUrlToImageId(url: string) {
  const filename = parseFilename(url, { strict: false })
  const [uid, ext] = filename?.split('.') ?? []
  return [uid, ext] as const
}

// => V2

// TODO handle multiple image versions from same source url

export const imagesReturn = v.object({
  _id: v.id('images_v2'),
  _creationTime: v.number(),
  sourceUrl: v.string(),
  sourceType: v.string(),
  id: v.string(),
  fileId: v.string(),
  format: v.string(),
  width: v.number(),
  height: v.number(),
  blurDataUrl: v.string(),
  createdAt: v.optional(v.number()),
  color: v.string(),

  generationId: v.optional(v.id('generations_v2')),
  runId: v.string(),
  ownerId: v.id('users'),
  collectionIds: v.array(v.id('collections')),
})

export const getImageV2Ent = async (ctx: QueryCtx, imageId: string) => {
  const _id = ctx.unsafeDb.normalizeId('images_v2', imageId)
  return _id
    ? await ctx.table('images_v2').get(_id)
    : await ctx.table('images_v2').get('id', imageId)
}

export const getImageV2Edges = async (ctx: QueryCtx, image: Ent<'images_v2'>) => {
  return {
    ...image.doc(),
    collectionIds: await image.edge('collections').map((c) => c._id),
  }
}

export const getImageV2ByOwnerIdSourceUrl = async (
  ctx: QueryCtx,
  ownerId: Id<'users'>,
  sourceUrl: string,
) => {
  const image = await ctx
    .table('images_v2', 'ownerId_sourceUrl', (q) =>
      q.eq('ownerId', ownerId).eq('sourceUrl', sourceUrl),
    )
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .first()
  return image ? await getImageV2Edges(ctx, image) : null
}

export const createImageV2 = internalMutation({
  args: {
    ...omit(imagesV2Fields, ['createdAt']),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const createdAt = args.createdAt ?? Date.now()

    let id
    while (!id || (await ctx.skipRules.table('images_v2').get('id', id))) {
      id = generateTimestampId(createdAt)
    }

    await ctx.skipRules.table('images_v2').insert({
      ...args,
      id,
      createdAt,
    })

    // await ctx.scheduler.runAfter(0, internal.action.generateImageVisionData.run, { imageId: id })
    return id
  },
})

export const listAllImagesNotInCollection = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await ctx.viewerX()
    const result = await ctx
      .table('images_v2', 'ownerId', (q) => q.eq('ownerId', viewer._id))
      .order('desc')
      .paginate(args.paginationOpts)
      .map(async (image) => {
        const collection = await image.edge('collections').first()
        return collection ? null : await getImageV2Edges(ctx, image)
      })

    return {
      ...result,
      page: result.page.filter((i) => i !== null),
    }
  },
})
