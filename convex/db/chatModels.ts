import { query } from '../functions'
import { getChatModelShape } from '../shared/shape'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('chat_models').map((model) => getChatModelShape(model))
    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})
