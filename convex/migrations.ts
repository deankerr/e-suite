import { asyncMap } from 'convex-helpers'
import { nanoid } from 'nanoid/non-secure'

import { internalMutation } from './functions'

export const clearExtraMessageData = internalMutation(async (ctx) => {
  const messages = await ctx.table('messages')
  await asyncMap(messages, async (m) => {
    await m.patch({
      voiceover: undefined,
      inference: undefined,
    })
  })
})

export const clearJobs = internalMutation(async (ctx) => {
  const jobs = await ctx.table('jobs')
  await asyncMap(jobs, async (j) => {
    await j.delete()
  })
})

export const threadConfig = internalMutation(async (ctx) => {
  const threads = await ctx.skipRules.table('threads')
  await asyncMap(threads, async (t) => {
    await t.patch({
      inference: t.config.ui,
      slashCommands: t.config.saved.map((c) => ({
        id: nanoid(),
        command: c.command ?? '',
        inference: c.inference,
      })),
    })
  })
})
