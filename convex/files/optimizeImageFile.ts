import { zid } from 'convex-helpers/server/zod'
import { v } from 'convex/values'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { acquireJob, jobResultSuccess } from '../jobs'
import { insist } from '../shared/utils'

export const init = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await acquireJob(ctx, args.jobId)

    const imageId = job.imageId
    insist(imageId, 'no imageId', { code: 'invalid_job_input' })
    const width = job.width
    insist(width, 'no width', { code: 'invalid_job_input' })

    const originFile = await ctx.skipRules
      .table('files', 'imageId', (q) => q.eq('imageId', imageId))
      .filter((q) => q.eq(q.field('isOriginFile'), true))
      .uniqueX()

    return { imageId, width, originFileId: originFile.fileId }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const input = await ctx.runMutation(internal.files.optimizeImageFile.init, {
      jobId: args.jobId,
    })

    const { fileId, metadata } = await ctx.runAction(internal.lib.sharp.convertToWebpAndResize, {
      fileId: input.originFileId,
      width: input.width,
    })

    await ctx.runMutation(internal.images.createImageFile, {
      ...metadata,
      fileId,
      imageId: input.imageId,
      format: 'webp',
      isOriginFile: false,
    })

    await ctx.runMutation(internal.files.optimizeImageFile.complete, {
      jobId: args.jobId,
    })
  },
})

export const complete = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, args) => {
    await jobResultSuccess(ctx, { jobId: args.jobId })
  },
})
