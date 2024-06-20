import { z } from 'zod'

import { mutation } from '../functions'
import { hasActiveJobName, insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'
import { getMessage, getMessageJobs } from './messages'
import { generateSpeech } from './speechFiles'

const fallbackResourceKey = 'openai::alloy'

export const generate = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    insist(message, 'invalid message id')
    insist(!message.voiceover, 'voiceover already exists')

    const text = message.content
    insist(text, 'invalid message content')

    // check for text generation in progress
    const jobs = await getMessageJobs(ctx, message)
    insist(!hasActiveJobName(jobs, 'inference/chat-completion'), 'text generation in progress')

    const textHash = await generateSha256Hash(text)
    const thread = await message.edgeX('thread')
    const resourceKey =
      thread.voiceovers?.names?.find((n) => n.name === message.name)?.resourceKey ??
      thread.voiceovers?.default ??
      fallbackResourceKey
    console.log('🚀 ~ handler: ~ resourceKey:', resourceKey)

    const speechFileId = await generateSpeech(ctx, {
      text,
      textHash,
      resourceKey,
    })
    await ctx.table('messages').getX(message._id).patch({
      voiceover: {
        textHash,
        resourceKey,
        speechFileId,
      },
    })
  },
})

export const remove = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    insist(message, 'invalid message id')
    insist(message.voiceover?.speechFileId, 'invalid message id')

    const speechFile = await ctx.table('speech_files').getX(message.voiceover.speechFileId)
    await ctx
      .table('messages', 'speechId')
      .filter((q) => q.eq(q.field('voiceover.speechFileId'), speechFile._id))
      .map((m) => m.patch({ voiceover: undefined }))

    if (speechFile.fileId) await ctx.storage.delete(speechFile.fileId)
    await speechFile.delete()
  },
})
