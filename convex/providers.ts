import { mutation } from './_generated/server'

export const addSinkinModels = mutation(async (ctx, data) => {
  await ctx.db.insert('models_sinkin', data)
})
