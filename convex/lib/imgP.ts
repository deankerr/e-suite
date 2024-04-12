import { internalMutation } from '../functions'
import { imgPObject } from '../schema'

export const add = internalMutation({
  args: {
    data: imgPObject,
  },
  handler: async (ctx, { data }) => {
    const obj = {
      hl: null,
      geo: null,
      ip: null,
      ag: null,
      ...data,
    }
    await ctx.table('imgp_test').insert(obj)
  },
})
