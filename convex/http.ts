import { httpRouter } from 'convex/server'
import { ConvexError } from 'convex/values'

import { internal } from './_generated/api'
import { httpAction } from './_generated/server'
import { handleWebhook } from './providers/clerk'

import type { Id } from './_generated/dataModel'
import type { GenericActionCtx } from 'convex/server'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({
  pathPrefix: '/i/',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { pathname, searchParams } = new URL(request.url)

    const path = pathname.split('/')[2] as string
    const result =
      path.length === 32
        ? await ctx.runQuery(internal.app_images.get, { appImageId: path as Id<'app_images'> })
        : await ctx.runQuery(internal.generated_images.getI, { rid: path.slice(0, 6) })

    if (!result) {
      return new Response('Invalid image id', {
        status: 400,
      })
    }

    const widthParam = Number(searchParams.get('w'))
    if (!result.srcset) {
      // add srcset to older images
      await ctx.runMutation(internal.generated_images.checkSrcset, { generatedImageId: result._id })
      // result lacks srcset, return original
      return await getFileResponse(ctx, result.fileId)
    }

    if (widthParam && result.width >= Number(widthParam)) {
      // requested width is larger than original, return original
      return await getFileResponse(ctx, result.fileId)
    }

    const shouldFindResized = widthParam && result.width > Number(widthParam)

    const resizedFileId = shouldFindResized
      ? result?.srcset
          ?.sort((a, b) => b.width - a.width)
          .find(({ width }) => widthParam && width === widthParam)?.fileId
      : undefined

    if (shouldFindResized && !resizedFileId) console.warn('not found:', widthParam)
    return await getFileResponse(ctx, resizedFileId ?? result.fileId)
  }),
})

const getFileResponse = async (ctx: GenericActionCtx<any>, fileId: Id<'_storage'>) => {
  const blob = await ctx.storage.get(fileId)
  if (!blob) throw new ConvexError({ message: 'unable to get file id', fileId })
  return new Response(blob)
}

export default http
