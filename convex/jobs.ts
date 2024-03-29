import { internal } from './_generated/api'
import { internalMutation } from './functions'
import { jobFields } from './schema'
import { error } from './util'

import type { Id } from './_generated/dataModel'
import type { JobStatus, QueryCtx } from './types'

export const dispatch = internalMutation({
  args: {
    type: jobFields.type,
    messageId: jobFields.messageId,
    imageId: jobFields.imageId,
    voiceoverId: jobFields.voiceoverId,
  },
  handler: async (ctx, args) => {
    if (args.type === 'inference' && args.messageId) {
      const id = await ctx.table('jobs').insert({ ...args, status: 'pending' })
      await ctx.scheduler.runAfter(0, internal.threads.inference.chat, {
        messageId: args.messageId,
      })
      return id
    }

    if (args.type === 'generation' && args.imageId) {
      const id = await ctx.table('jobs').insert({ ...args, status: 'pending' })
      await ctx.scheduler.runAfter(0, internal.generations.run.generate, {
        imageId: args.imageId,
      })
      return id
    }

    throw error('Invalid job dispatch')
  },
})

export const event = internalMutation({
  args: {
    ...jobFields,
  },
  handler: async (ctx, args) => await ctx.table('jobs').insert(args),
})

export const getJobStatus = async (
  ctx: QueryCtx,
  jobId?: Id<'_scheduled_functions'>,
): Promise<JobStatus> => {
  if (!jobId) return 'unknown'
  const job = await ctx.unsafeDb.system.get(jobId)
  return job ? job.state.kind : 'unknown'
}
