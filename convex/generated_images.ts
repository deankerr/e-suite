import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { slugIdLength } from './constants'
import { internalMutation, query } from './functions'
import { generateRandomString } from './lib/utils'
import { generatedImagesFields } from './schema'

import type { MutationCtx } from './types'

const generateSlugId = async (ctx: MutationCtx): Promise<string> => {
  const slugId = generateRandomString(slugIdLength)
  const existing = await ctx
    .table('generated_images', 'slugId', (q) => q.eq('slugId', slugId))
    .first()
  return existing ? generateSlugId(ctx) : slugId
}

export const create = internalMutation({
  args: {
    ...generatedImagesFields,
    generationId: zid('generations'),
  },
  handler: async (ctx, args) => {
    const slugId = await generateSlugId(ctx)
    return await ctx.table('generated_images').insert({
      ...args,
      slugId,
    })
  },
})

export const getBySlugId = query({
  args: {
    slugId: z.string(),
  },
  handler: async (ctx, { slugId }) => {
    const image = await ctx
      .table('generated_images', 'slugId', (q) => q.eq('slugId', slugId))
      .firstX()
    return image
  },
})
