import { zid } from 'convex-helpers/server/zod'
import { v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, handleJobError, jobResultSuccess } from '../jobs'
import { fileAttachmentRecordSchema } from '../shared/structures'
import { insist } from '../shared/utils'

export const init = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const url = job.url
    insist(url, 'no url', { code: 'invalid_job_input' })
    const messageId = job.messageId
    insist(messageId, 'no messageId', { code: 'invalid_job_input' })

    return { url, messageId }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const input = await ctx.runMutation(internal.files.createImageFromUrl.init, {
        jobId: args.jobId,
      })

      const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.storeImageFromUrl, {
        url: input.url,
      })

      const imageId = await ctx.runMutation(internal.images.createImage, {
        ...metadata,
        fileId,
        messageId: input.messageId,
        originUrl: input.url,
        generationData: [],
      })

      await ctx.runMutation(internal.files.createImageFromUrl.complete, {
        jobId: args.jobId,
        messageId: input.messageId,
        file: { type: 'image', id: imageId },
        url: input.url,
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
    url: z.string(),
    file: fileAttachmentRecordSchema,
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    const files = message.files ?? []
    const replaceUrlIndex =
      files.findIndex((f) => f.type === 'image_url' && f.url === args.url) ??
      message.files?.length ??
      0
    await message.patch({ files: files.with(replaceUrlIndex, args.file) })

    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
