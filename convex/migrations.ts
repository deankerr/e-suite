import { makeMigration } from 'convex-helpers/server/migrations'

import { internalMutation } from './_generated/server'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

// export const threadsDepFields2 = migration({
//   table: 'threads',
//   migrateOne: async (ctx, doc) => {
//     if (doc.favorite !== undefined) {
//       return {
//         ...doc,
//         favorite: undefined,
//       }
//     }
//     return doc
//   },
// })

// export const messagesDepFields = migration({
//   table: 'messages',
//   migrateOne: async (ctx, doc) => {
//     if (doc.contentType || doc.inference) {
//       return {
//         ...doc,
//         contentType: undefined,
//         inference: undefined,
//       }
//     }
//     return doc
//   },
//   batchSize: 500,
// })
