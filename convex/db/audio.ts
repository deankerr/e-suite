import { nullable } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { internalMutation, query } from '../functions'

export const audioReturnFields = v.object({
  _id: v.id('audio'),
  _creationTime: v.number(),
  fileId: v.id('_storage'),
  fileUrl: nullable(v.string()),
  generationData: v.object({
    prompt: v.string(),
    modelId: v.string(),
    modelName: v.string(),
    endpointId: v.string(),
    duration: v.optional(v.number()),
  }),
  messageId: v.id('messages'),
  threadId: v.id('threads'),
  userId: v.id('users'),
})

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

export const get = query({
  args: {
    audioId: v.id('audio'),
  },
  handler: async (ctx, { audioId }) => {
    const audio = await ctx.table('audio').get(audioId)
    return audio ? { ...audio, fileUrl: await ctx.storage.getUrl(audio.fileId) } : null
  },
  returns: nullable(audioReturnFields),
})

export const getByMessageId = query({
  args: {
    messageId: v.id('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const audios = await ctx.table('audio', 'messageId', (q) => q.eq('messageId', messageId))
    return audios
  },
})
