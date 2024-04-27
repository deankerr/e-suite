import { httpRouter } from 'convex/server'

import { api } from './_generated/api'
import { httpAction } from './_generated/server'
import { handleWebhook } from './providers/clerk'

const http = httpRouter()

http.route({
  path: '/clerk',
  method: 'POST',
  handler: handleWebhook,
})

http.route({
  path: '/ddddi',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    const rid = searchParams.get('id') as string
    const result = await ctx.runQuery(api.generated_images.get, { rid })

    const blob = result ? await ctx.storage.get(result.fileId) : null

    if (blob === null) {
      return new Response('Invalid image id', {
        status: 400,
      })
    }

    return new Response(blob)
  }),
})

http.route({
  pathPrefix: '/i/',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { pathname } = new URL(request.url)
    const rid = pathname.split('/')[2] as string
    const result = await ctx.runQuery(api.generated_images.get, { rid })

    const blob = result ? await ctx.storage.get(result.fileId) : null

    if (blob === null) {
      return new Response('Invalid image id', {
        status: 400,
      })
    }

    return new Response(blob)
  }),
})

export default http
