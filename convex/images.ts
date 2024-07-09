import { v } from 'convex/values'

import { internal } from './_generated/api'
import { httpAction } from './_generated/server'
import { visionModels } from './endpoints/fal'
import { internalMutation, internalQuery } from './functions'
import { createJob } from './jobs'
import { imageFields } from './schema'

const srcSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export const createImage = internalMutation({
  args: {
    ...imageFields,
  },
  handler: async (ctx, args) => {
    const modelId = visionModels[Math.floor(Math.random() * visionModels.length)] as string
    const imageId = await ctx.table('images').insert({ ...args, captionModelId: modelId })

    await createJob(ctx, {
      name: 'inference/captionImage',
      fields: {
        imageId,
      },
    })

    await createJob(ctx, {
      name: 'inference/assessNsfw',
      fields: {
        imageId,
      },
    })

    return imageId
  },
})

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
export const serveOptimizedImage = httpAction(async (ctx, request) => {
  const imageRequest = parseRequestUrl(request.url, '/i')
  if (!imageRequest || !imageRequest.id) return new Response('invalid request', { status: 400 })
  const image = await ctx.runQuery(internal.images.getImage, {
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
