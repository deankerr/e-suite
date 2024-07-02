import { zid } from 'convex-helpers/server/zod'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { getImageModelByResourceKey } from '../db/imageModels'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, createJob, handleJobError, jobResultSuccess } from '../jobs'
import { fal } from '../providers/fal'
import { sinkin } from '../providers/sinkin'
import { fileAttachmentRecordSchema } from '../shared/structures'
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
      inference && inference.type === 'text-to-image',
      'text-to-image message lacks parameters',
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
      const message = await ctx.runMutation(internal.inference.textToImage.init, {
        jobId: args.jobId,
      })
      if (!message) return

      const { inference } = message

      const { result, error } =
        inference.endpoint === 'sinkin'
          ? await sinkin.textToImage({
              parameters: inference,
            })
          : await fal.textToImage({
              parameters: inference,
            })

      if (error) {
        await ctx.runMutation(internal.jobs.resultError, {
          jobId: args.jobId,
          error: { code: 'endpoint_error', message: error.message, fatal: true },
        })
        return
      }

      await ctx.runMutation(internal.inference.textToImage.complete, {
        jobId: args.jobId,
        messageId: message._id,
        files: result.urls.map((url) => ({ type: 'image_url' as const, url })),
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
    files: fileAttachmentRecordSchema.array(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    const files = (message.files ?? []).concat(args.files)
    await message.patch({ files })

    for (const file of files) {
      if (file.type === 'image_url') {
        await createJob(ctx, 'files/create-image-from-url', {
          url: file.url,
          messageId: args.messageId,
        })
      }
    }

    // set thread title
    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (!thread.title && message.inference?.type === 'text-to-image') {
      const model = await getImageModelByResourceKey(ctx, message.inference.resourceKey)
      const title = model?.name ?? 'Generation'
      await thread.patch({ title })
    }

    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
