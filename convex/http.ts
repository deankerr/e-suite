import { httpRouter } from 'convex/server'
import { Id } from './_generated/dataModel'
import { httpAction } from './_generated/server'

const http = httpRouter()

http.route({
  path: '/image',
  method: 'GET',
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url)
    //TODO authorized to get image
    const storageId = searchParams.get('storageId') as Id<'_storage'>
    const blob = await ctx.storage.get(storageId)
    if (blob === null) {
      return new Response('Image not found', {
        status: 400,
      })
    }
    return new Response(blob)
  }),
})

export default http
