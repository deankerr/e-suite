import { asyncMap } from 'convex-helpers'
import { makeMigration, startMigration } from 'convex-helpers/server/migrations'

import { internal } from './_generated/api'
import { internalAction, internalMutation } from './_generated/server'
import { defaultRunConfigChat, defaultRunConfigTextToImage } from './shared/defaults'

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

export const runConfig = internalMutation(async (ctx) => {
  const threads = await ctx.db.query('threads').collect()
  await asyncMap(threads, async (thread) => {
    const inf = thread?.inference as
      | { type: 'chat-completion' | 'text-to-image'; resourceKey: string }
      | undefined

    if (inf?.type === 'chat-completion') {
      return await ctx.db.patch(thread._id, {
        latestRunConfig: {
          type: 'chat',
          resourceKey: inf.resourceKey ?? defaultRunConfigChat.resourceKey,
        },
        inference: undefined,
      })
    } else if (inf?.type === 'text-to-image') {
      return await ctx.db.patch(thread._id, {
        latestRunConfig: {
          type: 'textToImage',
          resourceKey: inf.resourceKey ?? defaultRunConfigTextToImage.resourceKey,
        },
        inference: undefined,
      })
    }

    return await ctx.db.patch(thread._id, {
      latestRunConfig: defaultRunConfigChat,
      inference: undefined,
    })
  })
})
