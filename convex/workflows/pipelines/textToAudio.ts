import { v } from 'convex/values'
import * as vb from 'valibot'

import { internal } from '../../_generated/api'
import * as ElevenLabs from '../../endpoints/elevenlabs'
import { internalMutation } from '../../functions'

import type { Id } from '../../_generated/dataModel'
import type { Pipeline } from '../types'

const InitialInput = vb.object({
  initial: vb.object({
    messageId: vb.pipe(
      vb.string(),
      vb.transform((input) => input as Id<'messages'>),
    ),
    prompt: vb.string(),
    duration: vb.optional(vb.number()),
  }),
})

export const textToAudioPipeline: Pipeline = {
  name: 'textToAudio',
  steps: [
    {
      name: 'inference',
      retryLimit: 3,
      action: async (ctx, input) => {
        const {
          initial: { messageId, prompt, duration },
        } = vb.parse(InitialInput, input)

        console.log('[textToAudio] [input] [elevenlabs]', prompt)
        const fileId = await ElevenLabs.soundGeneration(ctx, {
          text: prompt,
          duration_seconds: duration,
        })

        const audioId = await ctx.runMutation(internal.workflows.pipelines.textToAudio.complete, {
          messageId,
          fileId,
          prompt,
          duration,
        })

        return { audioId }
      },
    },
  ],
}

export const complete = internalMutation({
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
