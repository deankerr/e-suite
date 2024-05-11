import { z } from 'zod'

import { validators } from '../external'
import { query } from '../functions'

export const get = query({
  args: {
    rid: z.string(),
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null
    return validators.message.parse(message)
  },
})
