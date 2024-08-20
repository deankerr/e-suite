import { v } from 'convex/values'
import { getQuery } from 'ufo'

import { api } from '../_generated/api'
import { httpAction } from '../_generated/server'
import { query } from '../functions'

export const getMetadata = query({
  args: {
    route: v.string(),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.route === 'image') {
      const image = await ctx.table('images').get('uid', args.id)
      const thread = image ? await ctx.table('threads').get(image.threadId) : null
      if (image) {
        const imageTitle = image.generationData
          ? `${image.generationData.prompt} (${image.generationData.modelName})`
          : (image.captionTitle ?? 'Image')
        return {
          title: `${thread?.title ? thread.title + ' · ' : ''}${imageTitle}`,
          description: image.captionDescription ?? undefined,
        }
      }
    }

    if (args.route === 'images' || args.route === 'chat') {
      const thread = await ctx.table('threads').get('slug', args.id)
      if (thread) {
        return {
          title: thread.title ?? 'Untitled Thread',
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
