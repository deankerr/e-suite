import { v } from 'convex/values'
import { getQuery, parseFilename } from 'ufo'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { getImageModelByResourceKey } from '../db/models'
import { internalMutation, internalQuery } from '../functions'
import { imageFields } from '../schema'
import { getTextToImageConfig } from '../shared/utils'

import type { Doc } from '../_generated/dataModel'
import type { MutationCtx } from '../types'

export const createImageWf = internalMutation({
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
    })
    console.log('[image]', args.sourceUrl)

    if (!message.hasImageContent) {
      await message.patch({ hasImageContent: true })
    }

    return imageId
  },
})

const getGenerationData = async (ctx: MutationCtx, message: Doc<'messages'>) => {
  const textToImageConfig = getTextToImageConfig(message.inference)
  if (!textToImageConfig) {
    return undefined
  }

  const model = await getImageModelByResourceKey(ctx, textToImageConfig.endpointModelId)

  return {
    prompt: textToImageConfig.prompt,
    endpointId: textToImageConfig.endpoint,
    modelId: textToImageConfig.endpointModelId,
    modelName: model?.name ?? textToImageConfig.endpointModelId,
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

// * http
export const serve = httpAction(async (ctx, request) => {
  const id = parseFilename(request.url, { strict: false })

  const image = id
    ? await ctx.runQuery(internal.db.images.getImage, {
        imageId: id,
      })
    : null
  if (!image) return new Response('Not Found', { status: 404 })

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) throw new Error()

  const { download } = getQuery(request.url)
  if (download !== undefined) {
    return new Response(blob, {
      headers: {
        'Content-Disposition': `attachment; filename="${id}.${image.format}"`,
      },
    })
  }

  return new Response(blob)
})
