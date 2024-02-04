import { defineTable } from 'convex/server'
import { v } from 'convex/values'
import z from 'zod'
import { userMutation } from '../methods'

const threadsFields = {
  ownerId: v.id('users'),
  name: v.string(),
}

export const threadsTable = defineTable(threadsFields)

export const create = userMutation({
  args: {
    name: z
      .string()
      .min(1)
      .max(64)
      .optional()
      .transform((v) => (v ? v : 'Untitled thread')),
  },
  handler: async (ctx, { name }) => {
    await ctx.db.insert('threads', { ownerId: ctx.user._id, name })
  },
})
