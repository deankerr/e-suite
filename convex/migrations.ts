import { makeFunctionReference } from 'convex/server'
import { v } from 'convex/values'

import { internalAction, internalMutation } from './functions'

export const run = internalAction({
  args: {
    fn: v.string(),
    batchSize: v.number(),
    cursor: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { fn, batchSize, cursor = null }) => {
    let isDone = false
    while (!isDone) {
      const args = { cursor, numItems: batchSize }
      ;({ isDone, cursor } = await ctx.runMutation(
        makeFunctionReference<'mutation'>(`migrations:${fn}`),
        args,
      ))
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

export const imgSourceType = internalMutation({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { page, isDone, continueCursor } = await ctx.skipRules.table('images').paginate(args)

    for (const image of page) {
      if (image.sourceType) continue
      const sourceType = image.generationData ? 'textToImage' : 'user'
      await image.patch({ sourceType })
    }

    return { cursor: continueCursor, isDone }
  },
})

export const msgHasImg = internalMutation({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    const { page, isDone, continueCursor } = await ctx.skipRules.table('images').paginate(args)

    for (const image of page) {
      const message = await ctx.skipRules.table('messages').getX(image.messageId)
      if (!message.hasImageContent) {
        await message.patch({ hasImageContent: true })
      }
    }

    return { cursor: continueCursor, isDone }
  },
})
