import { pick } from 'convex-helpers'
import { makeMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { TableNames } from './_generated/dataModel'
import { internalMutation } from './_generated/server'
import { updateImageSearchText } from './db/images'
import { internalMutation as entsInternalMutation, internalAction } from './functions'

const migration = makeMigration(internalMutation, {
  migrationTable: 'migrations',
})

export const myMigration = migration({
  table: 'images',
  migrateOne: async (ctx, doc) => {
    const imageId = await ctx.db.insert('images_v1', {
      ...pick(doc, [
        'fileId',
        'sourceType',
        'sourceUrl',
        'format',
        'width',
        'height',
        'blurDataUrl',
        'color',
      ]),
      ownerId: doc.userId,
      id: `i${doc.uid}0`,
      sourceType: doc.generationData ? 'generation' : 'userMessageUrl',
      originalCreationTime: doc._creationTime,
    })

    const i2m = 'images_v1_to_messages' as TableNames
    const i2mData = {
      images_v1Id: imageId,
      messagesId: doc.messageId,
    } as any
    await ctx.db.insert(i2m, i2mData)

    const i2t = 'images_v1_to_threads' as TableNames
    const i2tData = {
      images_v1Id: imageId,
      threadsId: doc.threadId,
    } as any
    await ctx.db.insert(i2t, i2tData)

    if (doc.generationData) {
      await ctx.db.insert('images_metadata', {
        imageId,
        data: {
          type: 'generationData_V0',
          ...doc.generationData,
        },
      })
    }

    if (doc.captionTitle) {
      await ctx.db.insert('images_metadata', {
        imageId,
        data: {
          type: 'captionOCR_V0',
          captionDescription: doc.captionDescription ?? '',
          captionModelId: doc.captionModelId ?? '',
          captionTitle: doc.captionTitle ?? '',
          captionOCR: doc.captionOCR ?? '',
        },
      })
    }

    if (doc.nsfwProbability) {
      await ctx.db.insert('images_metadata', {
        imageId,
        data: {
          type: 'nsfwProbability',
          nsfwProbability: doc.nsfwProbability,
        },
      })
    }
  },
  batchSize: 100,
})

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
