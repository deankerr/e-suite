import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalMutation, internalQuery } from './functions'
import { jobEventFields, jobTypes } from './schema'

export const observe = internalQuery({
  args: {
    id: v.id('jobs'),
  },
  handler: async (ctx, { id }) => await ctx.table('jobs').getX(id),
})

export const dispatch = internalMutation({
  args: {
    type: jobTypes,
    ref: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.table('jobs').insert({ ...args, status: 'pending', events: [] })
    if (args.type === 'llm')
      await ctx.scheduler.runAfter(0, internal.threads.run.llm, { jobId: id, refId: args.ref })
    if (args.type === 'generate')
      await ctx.scheduler.runAfter(0, internal.generations.run.generate, {
        jobId: id,
        refId: args.ref,
      })
  },
})

export const update = internalMutation({
  args: {
    ...jobEventFields,
    id: v.id('jobs'),
  },
  handler: async (ctx, { id, ...event }) => {
    const job = await ctx.table('jobs').getX(id)
    return await ctx
      .table('jobs')
      .getX(id)
      .patch({
        status: event.status,
        events: [...job.events, { ...event, creationTime: Date.now() }],
      })
  },
})
