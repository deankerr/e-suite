import { omit } from 'convex-helpers'
import { partial } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { mutation, query } from '../functions'
import { prepareUpdate } from '../lib/utils'
import { patternFields } from '../schema'
import { getPattern, getPatternWriterX } from './helpers/patterns'
import { xid } from './helpers/xid'

// * Queries

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, { id }) => {
    return await getPattern(ctx, id).then((pattern) => pattern?.doc() ?? null)
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.viewerX()
    return await ctx.table('patterns').filter((q) => q.eq(q.field('userId'), user._id))
  },
})

const patternCreateFields = {
  ...partial(omit(patternFields, ['model'])),
  model: patternFields['model'],
}

// * Mutations

export const create = mutation({
  args: patternCreateFields,
  handler: async (
    ctx,
    {
      name = 'Untitled',
      description = '',
      instructions = '',
      initialMessasges = [],
      dynamicMessages = [],
      kvMetadata = {},
      model,
    },
  ) => {
    const user = await ctx.viewerX()

    const patternId = await ctx.table('patterns').insert({
      name,
      description,
      instructions,
      initialMessasges,
      dynamicMessages,
      kvMetadata,
      model,
      xid: xid('pattern'),
      userId: user._id,
      updatedAt: Date.now(),
      lastUsedAt: Date.now(),
    })

    return patternId
  },
})

export const update = mutation({
  args: {
    id: v.string(),
    ...partial(patternFields),
  },
  handler: async (ctx, { id, ...args }) => {
    const pattern = await getPatternWriterX(ctx, id)

    const defaults = {
      name: '',
      description: '',
      instructions: '',
    }

    const updates = prepareUpdate(args, defaults)

    return await pattern.patch(updates)
  },
})

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, { id }) => {
    const pattern = await getPatternWriterX(ctx, id)
    return await pattern.delete()
  },
})
