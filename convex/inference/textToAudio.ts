import { v } from 'convex/values'

import { internal } from '../_generated/api'
import * as ElevenLabs from '../endpoints/elevenlabs'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, handleJobError } from '../jobs'
import { getTextToAudioConfig, insist } from '../shared/utils'

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    insist(job.messageId, 'required: messageId', { code: 'invalid_job' })

    const message = await ctx.table('messages').getX(job.messageId)
    const textToAudioConfig = getTextToAudioConfig(message?.inference)
    insist(textToAudioConfig, 'required: text-to-audio config', {
      code: 'invalid_job',
    })

    return {
      job,
      messageId: message._id,
      textToAudioConfig,
    }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const { messageId, textToAudioConfig } = await ctx.runMutation(
        internal.inference.textToAudio.start,
        args,
      )

      const { prompt, duration_seconds, prompt_influence } = textToAudioConfig

      console.log('[textToAudio] [input] [elevenlabs]', prompt)
      const fileId = await ElevenLabs.soundGeneration(ctx, {
        text: prompt,
        duration_seconds,
        prompt_influence,
      })

      await ctx.runMutation(internal.inference.textToAudio.complete, {
        jobId: args.jobId,
        messageId,
        fileId,
        prompt,
      })
    } catch (error) {
      await handleJobError(ctx, { error, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    prompt: v.string(),
    fileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const { jobId, messageId, fileId, prompt } = args

    const message = await ctx.skipRules.table('messages').getX(messageId)

    await ctx.table('audio').insert({
      fileId,
      generationData: {
        prompt,
        modelId: 'sound-generation',
        modelName: 'ElevenLabs Sound Generation',
        endpointId: 'elevenlabs',
      },
      messageId,
      threadId: message.threadId,
      userId: message.userId,
    })

    await completeJob(ctx, { jobId })
  },
})
