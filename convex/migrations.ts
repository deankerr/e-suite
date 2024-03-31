import { Id } from './_generated/dataModel'
import { internalMutation } from './functions'
import { getNewThreadShape } from './threads/threads'

const fakeId = '' as Id<'users'>

export const threadsFields = internalMutation(async (ctx) => {
  const { roles, prompt } = getNewThreadShape({ userId: fakeId })
  const threads = await ctx.skipRules.table('threads')

  await Promise.all(
    threads.map(async (thread) => {
      await thread.patch({
        prompt,
        roles,
        systemPrompt: undefined,
        voices: undefined,
        name: undefined,
      })
    }),
  )
})
