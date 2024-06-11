import { query } from '../functions'
import { getImageModelShape } from '../shared/shape'

export const list = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.table('image_models').map((model) => getImageModelShape(model))
    return models.sort((a, b) => a.name.localeCompare(b.name))
  },
})
