import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { getVoiceModelsHelper } from '../db/speech'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs'
import { createOpenAiClient } from '../lib/openai'
import { insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'

import type OpenAI from 'openai'

export const init = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })
    const message = await ctx.table('messages').getX(messageId)
    const text = message.content
    insist(text, 'no text', { code: 'invalid_job_input' })

    const resourceKey = job.resourceKey
    insist(resourceKey, 'no resourceKey', { code: 'invalid_job_input' })

    return { messageId, text, resourceKey }
  },
})

export const run = internalAction({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const { messageId, text, resourceKey } = await ctx.runMutation(
        internal.inference.textToSpeech.init,
        {
          jobId: args.jobId,
        },
      )

      const voiceModels = getVoiceModelsHelper()
      const voice = voiceModels.find((model) => model.resourceKey === resourceKey)?.endpointModelId

      const api = createOpenAiClient('openai')
      const mp3 = await api.audio.speech.create({
        model: 'tts-1',
        voice: (voice ?? 'alloy') as OpenAI.Audio.Speech.SpeechCreateParams['voice'],
        input: text,
      })

      const blob = await mp3.blob()
      const fileId = await ctx.storage.store(blob)

      await ctx.runMutation(internal.inference.textToSpeech.complete, {
        jobId: args.jobId,
        messageId,
        text,
        resourceKey,
        fileId,
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs'),
    messageId: zid('messages'),
    text: z.string(),
    resourceKey: z.string(),
    fileId: zid('_storage'),
  },
  handler: async (ctx, { jobId, messageId, ...args }) => {
    const textHash = await generateSha256Hash(args.text)

    const speechId = await ctx.table('speech').insert({
      ...args,
      textHash,
    })

    await ctx.table('messages').getX(messageId).patch({ speechId })

    await jobResultSuccess(ctx, { jobId })
  },
})
