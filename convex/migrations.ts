import { makeMigration, startMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalAction, internalMutation } from './_generated/server'

const migration = makeMigration(internalMutation)

export const messageFields = migration({
  table: 'messages',
  migrateOne: async (ctx, doc) => {
    await ctx.db.patch(doc._id, {
      references: undefined,
      hasImageReference: undefined,
      hasImageContent: undefined,
    } as any)
  },
})

export const runMigration = internalAction(async (ctx) => {
  await startMigration(ctx, internal.migrations.messageFields, {
    startCursor: null, // optional override
    batchSize: 4000, // optional override
  })
})
