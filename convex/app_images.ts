import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { internalMutation, internalQuery, query } from './functions'
import { appImageFields } from './schema'
import { insist } from './utils'

export const create = internalMutation({
  args: appImageFields,
  handler: async (ctx, args) => {
    return await ctx.table('app_images').insert(args)
  },
})

export const importUrl = internalMutation({
  args: {
    url: z.string(),
  },
  handler: async (ctx, { url }) => {
    const existing = await ctx
      .table('app_images', 'sourceUrl', (q) => q.eq('sourceUrl', url))
      .first()
    insist(!existing, 'found existing for source url', {
      url,
      existing: existing?._id,
    })

    await ctx.scheduler.runAfter(0, internal.lib.sharp.createAppImageFromUrl, {
      sourceUrl: url,
    })
  },
})

export const get = internalQuery({
  args: {
    appImageId: zid('app_images'),
  },
  handler: async (ctx, { appImageId }) => {
    return await ctx.table('app_images').get(appImageId)
  },
})

export const getBySourceUrl = query({
  args: {
    sourceUrl: z.string(),
  },
  handler: async (ctx, { sourceUrl }) => {
    return await ctx.table('app_images', 'sourceUrl', (q) => q.eq('sourceUrl', sourceUrl)).first()
  },
})
