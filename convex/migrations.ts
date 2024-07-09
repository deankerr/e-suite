import { makeFunctionReference } from 'convex/server'
import { v } from 'convex/values'

import { internalAction, internalMutation } from './functions'

export const autoRunMigrations = internalAction({
  args: {
    fn: v.string(),
    cursor: v.union(v.string(), v.null()),
    batchSize: v.number(),
  },
  handler: async (ctx, { fn, cursor, batchSize }) => {
    let isDone = false
    while (!isDone) {
      const args = { cursor, numItems: batchSize }
      ;({ isDone, cursor } = await ctx.runMutation(makeFunctionReference<'mutation'>(fn), args))
    }
  },
})

export const migrationTemplate = internalMutation({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { page, isDone, continueCursor } = await ctx.skipRules.table('messages').paginate(args)

    for (const message of page) {
      // do something
      console.log(message._id)
    }

    return { cursor: continueCursor, isDone }
  },
})
