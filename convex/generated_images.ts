import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { external } from './external'
import { internalMutation, query } from './functions'
import { generatedImageFields, ridField } from './schema'
import { generateRid, runWithRetries } from './utils'

export const create = internalMutation({
  args: {
    ...generatedImageFields,
    generationId: zid('generations'),
  },
  handler: async (ctx, args) => {
    const rid = await generateRid(ctx, 'generated_images')

    return await ctx.table('generated_images').insert({
      ...args,
      rid,
      private: true,
    })
  },
})

export const createFromUrl = internalMutation({
  args: {
    sourceUrl: z.string(),
    generationId: zid('generations'),
  },
  handler: async (ctx, args) => {
    await runWithRetries(ctx, internal.lib.sharp.generationFromUrl, args)
  },
})

export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const image = await ctx
      .table('generated_images', 'rid', (q) => q.eq('rid', rid))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .firstX()
    return external.unit.generated_image.parse(image)
  },
})

export const _list = query({
  args: {
    limit: z.number().default(20),
  },
  handler: async (ctx, { limit }) => {
    return await ctx
      .table('generated_images')
      .order('desc')
      .take(limit)
      .map((image) => external.unit.generated_image.parse(image))
  },
})
