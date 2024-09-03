import { v } from 'convex/values'

import { internal } from '../_generated/api'
import * as ElevenLabs from '../endpoints/elevenlabs'
import { internalAction } from '../functions'

export const run = internalAction({
  args: {
    messageId: v.id('messages'),
    input: v.object({
      prompt: v.string(),
      duration: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { messageId, input }) => {
    const { prompt, duration } = input

    const fileId = await ElevenLabs.soundGeneration(ctx, {
      text: prompt,
      duration_seconds: duration,
    })

    await ctx.runMutation(internal.db.audio.create, {
      messageId,
      fileId,
      prompt,
      duration,
    })
  },
})
