import { query } from '../functions'
import { models } from '../providers/togetherai'

export const list = query({
  args: {},
  handler: async () => {
    return models
  },
})
