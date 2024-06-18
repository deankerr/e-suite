import { query } from '../functions'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('chat_models')
    return models.sort((a, b) => b.internalScore - a.internalScore)
  },
})
