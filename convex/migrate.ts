/* eslint-disable @typescript-eslint/no-unused-vars */
import { internalMutation } from './functions'

export const threads = internalMutation(async (ctx) => {
  const threads = await ctx.table('threads')

  for (const thread of threads) {
    const message = await thread.edge('messages').order('desc').first()
    const time = message?._creationTime ?? thread._creationTime
    // await thread.patch({ lastActivityTime: undefined, latestActivityTime: time })
  }
})
