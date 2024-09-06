import { v } from 'convex/values'
import { getQuery } from 'ufo'

import { api } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { query } from '../functions'
import { getImageWithEdges } from './images'

export const getMetadata = query({
  args: {
    route: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.route === 'image') {
      const image = await getImageWithEdges(ctx, args.id)
      if (image) {
        const caption = image.metadata.find((m) => m.type === 'captionOCR_V1')
        if (caption) {
          return {
            title: caption.title,
            description: caption.description,
          }
        }
        const input = image.generation?.input as { prompt: string } | undefined
        if (input) {
          return {
            title: input.prompt,
            description: input.prompt,
          }
        }
      }
    }

    if (args.route === 'images' || args.route === 'chat') {
      const thread = await ctx.table('threads').get('slug', args.id)
      if (thread && thread.title) {
        return {
          title: thread.title,
        }
      }
    }

    return null
  },
})

export const serveMetadata = httpAction(async (ctx, request) => {
  // convex.site/page?route=images&id=123
  const query = getQuery(request.url)
  const route = Array.isArray(query.route) ? query.route[0] : query.route
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  if (!route || !id) return Response.json({ error: 'Invalid route' }, { status: 400 })

  const result = await ctx.runQuery(api.db.page.getMetadata, { route, id })
  if (!result) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json(result)
})
