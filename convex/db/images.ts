import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { getImageModelByResourceKey } from '../db/imageModels'
import { visionModels } from '../endpoints/fal'
import { internalQuery } from '../functions'
import { createJob } from '../jobs'
import { getTextToImageConfig } from '../shared/utils'

import type { Doc } from '../_generated/dataModel'
import type { MutationCtx } from '../types'
import type { WithoutSystemFields } from 'convex/server'

const srcSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export const createImage = async (
  ctx: MutationCtx,
  args: Omit<WithoutSystemFields<Doc<'images'>>, 'threadId' | 'userId'>,
) => {
  const message = await ctx.skipRules.table('messages').getX(args.messageId)

  const modelId = visionModels[Math.floor(Math.random() * visionModels.length)] as string

  const imageId = await ctx.table('images').insert({
    ...args,
    captionModelId: modelId,
    userId: message.userId,
    threadId: message.threadId,
  })
  console.log('[image]', args.sourceUrl)

  // # captioning
  await createJob(ctx, {
    name: 'inference/captionImage',
    fields: {
      imageId,
    },
  })

  // # nsfw ranking
  await createJob(ctx, {
    name: 'inference/assessNsfw',
    fields: {
      imageId,
    },
  })

  if (!message.hasImageContent) {
    await message.patch({ hasImageContent: true })
  }

  return imageId
}

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
  const imageRequest = parseRequestUrl(request.url, '/i')
  if (!imageRequest || !imageRequest.id) return new Response('invalid request', { status: 400 })
  const image = await ctx.runQuery(internal.db.images.getImage, {
    imageId: imageRequest.id,
  })
  if (!image) return new Response('invalid image id', { status: 400 })

  const blob = await ctx.storage.get(image.fileId)
  return new Response(blob)
})

function parseRequestUrl(url: string, route: string) {
  const { pathname, searchParams } = new URL(url)

  // parse image id, extension from pathname
  const match = pathname.match(new RegExp(`^${route}/([^/]+)\\.([^/]+)$`, 'i'))
  if (!match) {
    console.error('invalid pathname', pathname)
    return null
  }
  const [, id, extension] = match

  // parse width param to closest valid size
  const width = srcSizes.findLast((size) => size <= Number(searchParams.get('w')))
  return { id, extension, width }
}
