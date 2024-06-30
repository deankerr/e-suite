import { asyncMap } from 'convex-helpers'

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
