import { httpRouter } from 'convex/server'

import { httpAction } from './_generated/server'

import type { Id } from './_generated/dataModel'

const http = httpRouter()

http.route({
  path: '/image',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    const storageId = searchParams.get('storageId') as Id<'_storage'>
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response('Image not found', {
        status: 400,
      })
    }
    return new Response(blob, {
      headers: {
        'content-type': 'image/png',
        'content-disposition': `attachment; filename="${storageId}.png"`,
      },
    })
  }),
})

export default http
