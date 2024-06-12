import { internalMutation } from './functions'

export const migrateMessages = internalMutation(async (ctx) => {
  const messages = await ctx.table('messages').filter((q) => q.neq('inference', undefined))
  for (const _m of messages) {
    //
  }
})
