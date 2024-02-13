import { internal } from './_generated/api'
import { internalMutation } from './functions'
import { jobFields } from './schema'
import { error } from './util'

export const dispatch = internalMutation({
  args: {
    type: jobFields.type,
    messageId: jobFields.messageId,
    imageId: jobFields.imageId,
  },
  handler: async (ctx, args) => {
    if (args.type === 'inference' && args.messageId) {
      const id = await ctx.table('jobs').insert({ ...args, status: 'pending' })
      await ctx.scheduler.runAfter(0, internal.threads.run.inference, {
        messageId: args.messageId,
      })
      return id
    }

    if (args.type === 'generation' && args.imageId) {
      const id = await ctx.table('jobs').insert({ ...args, status: 'pending' })
      await ctx.scheduler.runAfter(0, internal.generations.run.generate, {
        jobId: id,
        imageId: args.imageId,
      })
      return id
    }

    // TODO invalid job state
    throw error('Invalid job dispatch')
  },
})

export const event = internalMutation({
  args: {
    ...jobFields,
  },
  handler: async (ctx, args) => await ctx.table('jobs').insert(args),
})
