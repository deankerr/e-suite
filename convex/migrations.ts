import { makeMigration, startMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalAction, internalMutation } from './_generated/server'

const migration = makeMigration(internalMutation)

export const imageSearchableFields = migration({
  table: 'images',
  migrateOne: async (ctx, doc) => {
    await ctx.db.patch(doc._id, {
      captionText: undefined,
      captions: undefined,
      searchText: '',
    })
  },
})

export const runMigration = internalAction(async (ctx) => {
  await startMigration(ctx, internal.migrations.imageSearchableFields, {
    startCursor: null, // optional override
    batchSize: 4000, // optional override
  })
})
