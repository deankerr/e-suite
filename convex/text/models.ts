import { query } from '../_generated/server'
import { getModels } from '../providers/togetherai'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const togetherModels = await getModels(ctx, {})
    return togetherModels
  },
})
