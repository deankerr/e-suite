import { v } from 'convex/values'

import { internalMutation } from '../functions'

export const create = internalMutation({
  args: {
    messageId: v.id('messages'),
    fileId: v.id('_storage'),
    prompt: v.string(),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, fileId, prompt, duration }) => {
    const message = await ctx.skipRules.table('messages').getX(messageId)

    const audioId = await ctx.table('audio').insert({
      fileId,
      generationData: {
        prompt,
        modelId: 'sound-generation',
        modelName: 'ElevenLabs Sound Generation',
        endpointId: 'elevenlabs',
        duration,
      },
      messageId,
      threadId: message.threadId,
      userId: message.userId,
    })

    return audioId
  },
})
