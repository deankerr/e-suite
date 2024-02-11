import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalMutation, internalQuery } from './functions'
import { jobEventFields, jobRefs, jobTypes } from './schema'
import { error } from './util'

export const observe = internalQuery({
  args: {
    id: v.id('jobs'),
  },
  handler: async (ctx, { id }) => await ctx.table('jobs').getX(id),
})

export const dispatch = internalMutation({
  args: {
    type: jobTypes,
    ref: jobRefs,
  },
  handler: async (ctx, args) => {
    const id = await ctx.table('jobs').insert({ ...args, status: 'pending', events: [] })
    if (args.type === 'llm') await ctx.scheduler.runAfter(0, internal.threads.llm.llm, { id })
    if (args.type === 'generate')
      await ctx.scheduler.runAfter(0, internal.generations.generate.generate, { id })
  },
})

export const acquire = internalMutation({
  args: {
    id: v.id('jobs'),
    type: jobTypes,
  },
  handler: async (ctx, { id, type }) => {
    const job = await ctx.table('jobs').getX(id)

    if (job.type !== type) {
      const err = error('Job acquisition type mismatch', { job: job.type, acquire: type })
      await job.patch({
        status: 'error',
        events: [...job.events, { ...err, status: 'error', creationTime: Date.now() }],
      })
      throw err
    }
    if (!(job.status === 'pending' || job.status === 'error')) {
      const err = error('Job acquisition status error', { job: job.status })
      await job.patch({
        status: 'error',
        events: [...job.events, { ...err, status: 'error', creationTime: Date.now() }],
      })
      throw err
    }

    await job.patch({
      status: 'active',
      events: [...job.events, { status: 'active', creationTime: Date.now() }],
    })

    return job.ref
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
