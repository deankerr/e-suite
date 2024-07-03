import { v } from 'convex/values'

import { internal } from '../_generated/api'
import * as ElevenLabs from '../endpoints/elevenlabs'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs'
import { insist } from '../shared/utils'

export const init = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })

    const message = await ctx.table('messages').getX(messageId)

    const inference = message?.inference
    insist(
      inference && inference.type === 'sound-generation' && inference.prompt,
      'sound-generation message lacks parameters',
      {
        code: 'invalid_job_input',
      },
    )

    return { ...message, inference }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const message = await ctx.runMutation(internal.inference.soundGeneration.init, {
        jobId: args.jobId,
      })
      if (!message) return

      const {
        inference: { prompt, duration_seconds, prompt_influence },
      } = message

      console.log('[sfx]', prompt)
      const fileId = await ElevenLabs.soundGeneration(ctx, {
        text: prompt,
        duration_seconds,
        prompt_influence,
      })
      const fileUrl = (await ctx.storage.getUrl(fileId)) || ''

      await ctx.runMutation(internal.inference.soundGeneration.complete, {
        jobId: args.jobId,
        messageId: message._id,
        fileId,
        fileUrl,
        prompt,
      })
    } catch (err) {
      return await handleJobError(ctx, { err, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    prompt: v.string(),
    fileId: v.id('_storage'),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { jobId, messageId, fileId, fileUrl, prompt } = args

    const id = await ctx.table('sound_effect_files').insert({
      fileId,
      fileUrl,
      text: prompt,
    })

    const message = await ctx.skipRules.table('messages').getX(messageId)
    await message.patch({
      files: [...(message?.files || []), { type: 'sound_effect', id }],
    })

    await jobResultSuccess(ctx, { jobId })
  },
})
