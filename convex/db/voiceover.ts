import { z } from 'zod'

import { mutation } from '../functions'
import { insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'
import { getMessage } from './messages'
import { createSpeech } from './speechFiles'

export const generate = mutation({
  args: {
    messageId: z.string(),
    resourceKey: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    insist(message, 'invalid message id')

    if (message.voiceover) {
      // TODO error retrying etc.
      return null
    }

    const text = message.content
    insist(text, 'invalid message content')

    // TODO assess if text replacements needed

    const textHash = await generateSha256Hash(text)

    // TODO check for existing voiceover hash matches
    // TODO check for incomplete text

    const speechFileId = await createSpeech(ctx, { text, textHash, resourceKey: args.resourceKey })
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
