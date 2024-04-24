import { query } from './functions'

export const temp = query({
  args: {},
  handler: async (ctx, args) => {
    // await ctx.table("messages", 'perms', q => q.eq('perms', {}))
  },
})
