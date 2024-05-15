import { zid } from 'convex-helpers/server/zod'

import { internalMutation } from '../functions'
import { imageFields } from './schema'

export const create = internalMutation({
  args: {
    ...imageFields,
    messageId: zid('messages'),
  },
  handler: async (ctx, args) => await ctx.table('images').insert(args),
})
