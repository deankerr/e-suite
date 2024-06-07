/* eslint-disable @typescript-eslint/no-unused-vars */
import { internalMutation } from './functions'

export const threads = internalMutation(async (ctx) => {
  const threads = await ctx.table('threads')

  for (const thread of threads) {
    // const time = thread.latestActivityTime ?? thread._creationTime
    // const currentInferenceConfig = thread.config!
    // await thread.patch({
    //   latestActivityTime: undefined,
    //   updatedAtTime: time,
    //   config: undefined,
    //   currentInferenceConfig,
    // })
  }
})
