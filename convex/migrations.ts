import { makeMigration } from 'convex-helpers/server/migrations'

import { internalMutation } from './_generated/server'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

// export const imagesV1ToV2 = migration({
//   table: 'images_v1',
//   migrateOne: async (ctx, doc) => {

//   },
// })
