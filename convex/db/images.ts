import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'
import * as vb from 'valibot'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { getImageModelByResourceKey } from '../db/models'
import { internalMutation, internalQuery } from '../functions'
import { generateUid } from '../lib/utils'
import { imageFields } from '../schema'
import { createJob } from '../workflows/jobs'

import type { Ent, MutationCtx } from '../types'

export const createImage = internalMutation({
  args: {
    ...imageFields,
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)

    const imageId = await ctx.table('images').insert({
      ...args,
      userId: message.userId,
      threadId: message.threadId,
      generationData: await getGenerationData(ctx, message),
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
    return await ctx.table('images').getX(imageId).patch(args)
  },
})

const getGenerationData = async (ctx: MutationCtx, message: Ent<'messages'>) => {
  const jobs = await ctx.table('jobs3', 'messageId', (q) => q.eq('messageId', message._id))
  const job = jobs.find((job) => job.pipeline === 'textToImage')
  const result = vb.safeParse(
    vb.object({ input: vb.object({ resourceKey: vb.string(), prompt: vb.string() }) }),
    job,
  )
  if (!result.success) {
    return undefined
  }

  const { resourceKey, prompt } = result.output.input
  const model = await getImageModelByResourceKey(ctx, resourceKey)

  return {
    prompt,
    endpointId: model?.endpoint ?? '',
    modelId: model?.endpointModelId ?? '',
    modelName: model?.name ?? '',
  }
}

export const getImage = internalQuery({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const imageId = ctx.unsafeDb.normalizeId('images', args.imageId)
    const image = imageId ? await ctx.table('images').get(imageId) : null
    return image
  },
})

export const getImageByUid = internalQuery({
  args: {
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.table('images').get('uid', args.uid)
    return image
  },
})

// * http
export const serve = httpAction(async (ctx, request) => {
  const [uid] = parseUrlToUid(request.url)
  const image = uid
    ? await ctx.runQuery(internal.db.images.getImageByUid, {
        uid,
      })
    : null

  if (!image) {
    console.error('not found', uid)
    return new Response('Not Found', { status: 404 })
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
