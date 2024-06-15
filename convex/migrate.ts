import { internalMutation } from './functions'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from './shared/defaults'

export const migrateMessages = internalMutation(async (ctx) => {
  const messages = await ctx.table('messages').filter((q) => q.neq('inference', undefined))
  for (const _m of messages) {
    //
  }
})

export const migrateConfigs = internalMutation(async (ctx) => {
  const threads = await ctx.table('threads')
  for (const t of threads) {
    if (t.currentInferenceConfig?.type === 'text-to-image') {
      await t.patch({ currentInferenceConfig: defaultImageInferenceConfig })
    } else {
      await t.patch({ currentInferenceConfig: defaultChatInferenceConfig })
    }
  }
})
