import { ConvexError } from 'convex/values'

import { internal } from '../_generated/api'
import { httpAction } from '../_generated/server'

export const serveImage = httpAction(async (ctx, request) => {
  const url = new URL(request.url)
  const imageId = getIdFromPath(url.pathname, '/i')
  const image = imageId ? await ctx.runQuery(internal.images.query.get, { imageId }) : null
  console.log(imageId)
  if (!image) return new Response('invalid image id', { status: 400 })

  const blob = await ctx.storage.get(image.fileId)
  if (!blob) throw new ConvexError('unable to get file id')
  return new Response(blob)
})

// pathname should be '/i/<id>.ext', verify the route and return the id without extension
const getIdFromPath = (pathname: string, route: string) => {
  const match = pathname.match(new RegExp(`^${route}/([^/]+)\\.([^/]+)$`, 'i'))
  if (!match) return null

  const [, id, ext] = match
  if (ext !== 'webp') return null

  return id
}
