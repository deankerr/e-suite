import { v } from 'convex/values'
import { internalMutation, mutation, query } from '../functions'
import { generationParameters, permissions, v2imagesFields } from '../schema'
import { vEnum } from '../util'

export const create = internalMutation({
  args: {
    ...v2imagesFields,
    width: v.number(),
    height: v.number(),
    permissions: v.optional(permissions),
  },
  handler: async (ctx, args) => {},
})
