import { query } from '../functions'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('image_models')
    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
})
