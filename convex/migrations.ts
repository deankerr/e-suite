import { asyncMap } from 'convex-helpers'

import { internalMutation } from './functions'

export const clearExtraMessageData = internalMutation(async (ctx) => {
  const messages = await ctx.skipRules.table('messages')
  await asyncMap(messages, async (m) => {
    await m.patch({
      voiceover: undefined,
      inference: undefined,
    })
  })
})

export const clearJobs = internalMutation(async (ctx) => {
  const jobs = await ctx.skipRules.table('jobs')
  await asyncMap(jobs, async (j) => {
    await j.delete()
  })
})

export const commands = internalMutation(async (ctx) => {
  const threads = await ctx.skipRules.table('threads')
  await asyncMap(threads, async (t) => {
    await t.patch({
      slashCommands: t.slashCommands.map((c) => ({
        ...c,
        commandType: c.commandType ?? 'startsWith',
      })),
    })
  })
})
