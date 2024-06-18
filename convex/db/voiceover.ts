import { z } from 'zod'

import { mutation } from '../functions'
import { hasActiveJobName, insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'
import { getMessage, getMessageJobs } from './messages'
import { generateSpeech } from './speechFiles'

export const generate = mutation({
  args: {
    messageId: z.string(),
    resourceKey: z.string(),
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

    const speechFileId = await generateSpeech(ctx, {
      text,
      textHash,
      resourceKey: args.resourceKey,
    })
    await ctx
      .table('messages')
      .getX(message._id)
      .patch({
        voiceover: {
          textHash,
          resourceKey: args.resourceKey,
          speechFileId,
        },
      })
  },
})
