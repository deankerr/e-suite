import { makeMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalMutation } from './_generated/server'
import { updateImageSearchText } from './db/images'
import { internalMutation as entsInternalMutation, internalAction } from './functions'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

// export const myMigration = migration({
//   table: 'images',
//   migrateOne: async (ctx, doc) => {
//   }
// })

export const searchTextBatch = entsInternalMutation(
  async (ctx, { cursor, numItems }: { cursor: string | null; numItems: number }) => {
    const data = await ctx.table('images_v1').paginate({ cursor, numItems })
    const { page, isDone, continueCursor } = data
    for (const doc of page) {
      await updateImageSearchText(ctx, doc.id)
    }
    return { cursor: continueCursor, isDone }
  },
)

export const runSearchMigration = internalAction(
  async ({ runMutation }, { cursor, batchSize }: { cursor: string | null; batchSize: number }) => {
    let isDone = false
    while (!isDone) {
      const args = { cursor, numItems: batchSize }
      ;({ isDone, cursor } = await runMutation(internal.migrations.searchTextBatch, args))
    }
  },
)

export const migThreadConfig = entsInternalMutation({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.skipRules.table('threads')
    for (const thread of threads) {
      const latestRunConfig =
        thread.latestRunConfig?.type === 'textToImage'
          ? {
              ...thread.latestRunConfig,
              modelId: 'fal-ai/flex/dev',
            }
          : thread.latestRunConfig

      await thread.patch({ latestRunConfig })
    }
  },
})
