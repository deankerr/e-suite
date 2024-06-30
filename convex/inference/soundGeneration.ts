import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import * as ElevenLabs from '../endpoints/elevenlabs'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, jobResultSuccess } from '../jobs'
import { insist } from '../shared/utils'

export const init = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })

    const message = await ctx.table('messages').getX(messageId)
    const inference = message?.inference
    insist(
      inference && inference.type === 'sound-generation',
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
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const message = await ctx.runMutation(internal.inference.soundGeneration.init, {
        jobId: args.jobId,
      })
      if (!message) return

      const { inference } = message

      console.log('[sfx]', inference.prompt)
      const fileId = await ElevenLabs.soundGeneration(ctx, { text: inference.prompt })
      const fileUrl = (await ctx.storage.getUrl(fileId)) || ''

      await ctx.runMutation(internal.inference.soundGeneration.complete, {
        jobId: args.jobId,
        messageId: message._id,
        fileId,
        fileUrl,
        prompt: inference.prompt,
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs'),
    messageId: zid('messages'),
    prompt: z.string(),
    fileId: zid('_storage'),
    fileUrl: z.string(),
  },
  handler: async (ctx, args) => {
    const { jobId, messageId, fileId, fileUrl, prompt } = args

    await ctx.table('sound_effect_files').insert({
      fileId,
      fileUrl,
      text: prompt,
    })

    const message = await ctx.skipRules.table('messages').getX(messageId)
    await message.patch({
      files: [...(message?.files || []), { type: 'sound_effect', fileId, url: fileUrl }],
    })

    await jobResultSuccess(ctx, { jobId })
  },
})
