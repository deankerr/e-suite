import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { ActionCtx } from '../_generated/server'
import { getVoiceModels } from '../db/voiceModels'
import * as ElevenLabs from '../endpoints/elevenlabs'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, handleJobError } from '../jobs'
import { createOpenAiClient } from '../lib/openai'
import { insist } from '../shared/utils'

import type OpenAI from 'openai'

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    const { speechId, text, resourceKey } = job
    insist(speechId && text && resourceKey, 'required: speechId/text/resourceKey', {
      code: 'invalid_job',
    })

    return {
      job,
      speechId,
      text,
      resourceKey,
    }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args): Promise<void> => {
    try {
      const { job, speechId, text, resourceKey } = await ctx.runMutation(
        internal.inference.textToSpeech.start,
        {
          jobId: args.jobId,
        },
      )

      const voiceModels = getVoiceModels()
      const voice = voiceModels.find((model) => model.resourceKey === resourceKey)
      insist(voice, 'voice model not found')

      console.log('[tts]', voice.resourceKey, text)
      const fileId =
        voice.endpoint === 'aws'
          ? await ctx.runAction(internal.endpoints.aws_node.textToSpeech, {
              text: text,
              endpointModelId: voice.endpointModelId,
            })
          : voice.endpoint === 'elevenlabs'
            ? await ElevenLabs.textToSpeech(ctx, {
                text: text,
                endpointModelId: voice.endpointModelId,
              })
            : await openAiTTS(ctx, { text: text, voice: voice.endpointModelId })

      await ctx.runMutation(internal.inference.textToSpeech.complete, {
        jobId: job._id,
        speechId,
        fileId,
      })
    } catch (error) {
      await handleJobError(ctx, { error, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    speechId: v.id('speech'),
    fileId: v.id('_storage'),
  },
  handler: async (ctx, { jobId, speechId, fileId }) => {
    await ctx.table('speech').getX(speechId).patch({
      fileId,
    })

    await completeJob(ctx, { jobId })
  },
})

const openAiTTS = async (ctx: ActionCtx, { text, voice }: { text: string; voice: string }) => {
  const api = createOpenAiClient('openai')
  const mp3 = await api.audio.speech.create({
    model: 'tts-1',
    voice: (voice ?? 'alloy') as OpenAI.Audio.Speech.SpeechCreateParams['voice'],
    input: text,
  })
  const blob = await mp3.blob()

  return ctx.storage.store(blob)
}
