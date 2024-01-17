import { defineTable, DocumentByName, paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import { Doc, Id, TableNames } from './_generated/dataModel'
import { internalMutation, mutation, MutationCtx, query, QueryCtx } from './_generated/server'
import { generationStatus } from './constants'
import { vEnum } from './util'

export const generationsParameterFields = {
  imageModelId: v.id('imageModels'),
  imageModelProviderId: v.id('imageModelProviders'),

  prompt: v.string(),
  width: v.number(),
  height: v.number(),
  n: v.number(),

  negativePrompt: v.optional(v.string()),
  seed: v.optional(v.number()),
  scheduler: v.optional(v.string()),
  steps: v.optional(v.number()),
  guidance: v.optional(v.number()),
  lcm: v.optional(v.boolean()),
}

export const generationsEventFields = {
  status: vEnum(generationStatus),
  message: v.optional(v.string()),
  data: v.optional(v.any()),
}

export const generationsInternalFields = {
  imageIds: v.array(v.id('images')),
  status: vEnum(generationStatus),
  events: v.array(v.object({ ...generationsEventFields, createdAt: v.number() })),
  hidden: v.boolean(),
}

export const generationsTable = defineTable({
  ...generationsParameterFields,
  ...generationsInternalFields,
})

export const pageWithImages = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db.query('generations').paginate(paginationOpts)

    const generationsWithImages = await Promise.all(
      result.page.map(async (generation) => {
        return {
          ...generation,
          images: await Promise.all(generation.imageIds.map(async (id) => await ctx.db.get(id))),
        }
      }),
    )

    return {
      ...result,
      page: generationsWithImages,
    }
  },
})

export const page = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db.query('generations').paginate(paginationOpts)

    const pageAndRelations = await Promise.all(
      result.page.map(async (generation) => ({
        generation,
        images: await Promise.all(generation.imageIds.map(async (id) => await ctx.db.get(id))),
        imageModel: await ctx.db.get(generation.imageModelId),
        imageModelProvider: await ctx.db.get(generation.imageModelProviderId),
      })),
    )

    return { ...result, page: pageAndRelations }
  },
})

// const resolveDocument = async <T extends TableNames, I extends Id<T> | Id<T>[]>(
//   ctx: QueryCtx | MutationCtx,
//   docIds: I,
// ): Promise<I extends Id<T>[] ? (Doc<T> | null)[] : Doc<T> | null> => {
//   if (Array.isArray(docIds))
//     return await Promise.all(docIds.map(async (id) => await ctx.db.get(id)))
//   return await ctx.db.get(docIds)
// }

// const resolveDocuments = async <T extends TableNames, I extends Id<T>[], R extends Doc<T>[]>(
//   ctx: QueryCtx | MutationCtx,
//   docIds: I,
// ): Promise<Awaited<R>> => {
//   return await Promise.all(docIds.map(async (id) => await ctx.db.get(id)))
// }

// const dresolve = async <T extends TableNames, R extends >(ctx: QueryCtx | MutationCtx, docs: Doc<T>[]) => {

// }

export const get = query({
  args: { id: v.id('generations') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const runJobId = internalMutation({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, { id }) => {
    const job = await ctx.db.get(id)
    if (!job) throw new ConvexError({ message: 'invalid generation', id, job })
    if (job.status !== 'pending') throw new ConvexError({ message: 'invalid job status', job })

    const provider = await ctx.db.get(job.imageModelProviderId)
    if (!provider) throw new ConvexError({ message: 'invalid provider', job, provider })

    await ctx.db.patch(job._id, {
      status: 'acting',
      events: [{ status: 'acting', createdAt: Date.now() }],
    })

    return { job, provider }
  },
})

export const create = mutation({
  args: {
    ...generationsParameterFields,
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('generations', {
      ...args,
      imageIds: [],
      status: 'pending',
      events: [],
      hidden: false,
    })

    //^ determine correct provider when we have more
    await ctx.scheduler.runAfter(0, internal.providers.sinkin.run, { id })

    return id
  },
})

export const update = internalMutation({
  args: {
    id: v.id('generations'),
    ...generationsEventFields,
    imageIds: v.optional(v.array(v.id('images'))),
  },
  handler: async (ctx, { id, imageIds, status, message, data }) => {
    const generation = await ctx.db.get(id)
    if (!generation) throw new ConvexError({ message: 'invalid generation', id, generation })

    const statusFields = {
      status,
      events: [...generation.events, { status, message, data, createdAt: Date.now() }],
    }

    if (imageIds) {
      await ctx.db.patch(id, { imageIds, ...statusFields })
    } else {
      await ctx.db.patch(id, statusFields)
    }
  },
})
