import { omit } from 'convex-helpers'
import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'
import * as vb from 'valibot'

import { api } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { getImageModelByResourceKey } from '../db/models'
import { internalMutation, internalQuery, mutation, query } from '../functions'
import { generateUid } from '../lib/utils'
import { imageFields, imagesFieldsV1 } from '../schema'
import { createJob } from '../workflows/jobs'
import { getMessageAndEdges } from './messages'
import { getUserIsViewer, getUserPublic } from './users'

import type { Doc } from '../_generated/dataModel'
import type { Ent, MutationCtx, QueryCtx } from '../types'

export const getImageV1 = async (ctx: QueryCtx, imageId: string) => {
  const image = await ctx.table('images_v1').getX('id', imageId)
  return {
    ...image,
    userIsViewer: getUserIsViewer(ctx, image.ownerId),
    url: (await ctx.storage.getUrl(image.fileId)) || '',
  }
}

export const createImage = internalMutation({
  args: {
    ...imageFields,
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)

    const imageId = await ctx.skipRules.table('images').insert({
      ...args,
      userId: message.userId,
      threadId: message.threadId,
      searchText: buildSearchText(args),
      generationData: await getGenerationData(ctx, message, args.sourceUrl),
      uid: generateUid(Date.now()),
    })

    const url = await ctx.storage.getUrl(args.fileId)
    if (url) {
      await createJob.generateImageMetadata(ctx, { imageId, url })
    }

    return imageId
  },
})

export const updateImage = internalMutation({
  args: {
    imageId: v.id('images'),
    ...partial(imageFields),
  },
  handler: async (ctx, { imageId, ...args }) => {
    const image = await ctx.skipRules.table('images').getX(imageId)
    const searchText = buildSearchText({ ...image, ...args })
    return await ctx.skipRules
      .table('images')
      .getX(imageId)
      .patch({ ...args, searchText })
  },
})

const buildSearchText = (fields: Partial<Doc<'images'>>) => {
  let searchText = ''

  if (fields.captionTitle) {
    searchText += fields.captionTitle + ' '
  }
  if (fields.captionDescription) {
    searchText += fields.captionDescription + ' '
  }
  if (fields.captionOCR) {
    searchText += fields.captionOCR + ' '
  }
  if (fields.objects) {
    const set = new Set(fields.objects.map((obj) => obj.label))
    searchText += Array.from(set).join(' ')
  }
  return searchText
}

const getGenerationData = async (ctx: MutationCtx, message: Ent<'messages'>, sourceUrl: string) => {
  const jobs = await ctx
    .table('jobs3', 'messageId', (q) => q.eq('messageId', message._id))
    .filter((q) => q.eq(q.field('pipeline'), 'textToImage'))

  for (const job of jobs) {
    const result = vb.safeParse(
      vb.object({
        input: vb.object({ resourceKey: vb.string(), prompt: vb.string() }),
        stepResults: vb.array(
          vb.object({
            result: vb.object({
              imageUrls: vb.array(vb.string()),
            }),
          }),
        ),
      }),
      job,
    )

    if (!result.success) continue
    // find the matching source url
    const match = result.output.stepResults.find((step) =>
      step.result.imageUrls.includes(sourceUrl),
    )
    if (match) {
      const { resourceKey, prompt } = result.output.input
      const model = await getImageModelByResourceKey(ctx, resourceKey)

      return {
        prompt,
        endpointId: model?.endpoint ?? '',
        modelId: model?.endpointModelId ?? '',
        modelName: model?.name ?? '',
      }
    }
  }
}

export const get = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const imageId = ctx.unsafeDb.normalizeId('images', args.imageId)
    const image = imageId ? await ctx.table('images').get(imageId) : null
    return image
  },
})

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

export const getById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images_v1').get('id', args.id)
    if (!image) return null
    return {
      ...image,
      userIsViewer: getUserIsViewer(ctx, image.ownerId),
      url: (await ctx.storage.getUrl(image.fileId)) || '',
    }
  },
})

export const getImageMessage = query({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images').get('uid', args.uid)
    if (!image) return null
    return await getMessageAndEdges(ctx, image.messageId)
  },
})

export const remove = mutation({
  args: {
    imageId: v.id('images'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('images').getX(args.imageId).delete()
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
      id: generateUid(Date.now()),
    })
  },
})
