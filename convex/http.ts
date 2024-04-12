import { httpRouter } from 'convex/server'

import { internal } from './_generated/api'
import { httpAction } from './_generated/server'
import { handleWebhook } from './providers/clerk'
import { imgPObject } from './schema'

import type { Id } from './_generated/dataModel'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

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

http.route({
  path: '/imgp',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const req = imgPObject.parse(await request.json())

    await ctx.runMutation(internal.lib.imgP.add, { data: req })

    return new Response()
  }),
})

export default http
