import { v } from 'convex/values'
import { internalMutation, mutation, query } from '../functions'
import { generationParameters, imagesFields, permissions } from '../schema'
import { vEnum } from '../util'

export const create = internalMutation({
  args: {
    ...imagesFields,
    width: v.number(),
    height: v.number(),
    permissions: v.optional(permissions),
  },
  handler: async (ctx, args) => {},
})
