import { makeMigration, startMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalAction, internalMutation } from './_generated/server'
import { generateUid } from './utils'

const migration = makeMigration(internalMutation)

export const imageUid = migration({
  table: 'images',
  migrateOne: async (ctx, doc) => {
    await ctx.db.patch(doc._id, { uid: generateUid(doc._creationTime) })
  },
})

export const runMigration = internalAction(async (ctx) => {
  await startMigration(ctx, internal.migrations.imageUid, {
    startCursor: null, // optional override
    batchSize: 1000, // optional override
  })
})
