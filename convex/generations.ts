import { defineEnt } from 'convex-ents'
import { customMutation } from 'convex-helpers/server/customFunctions'
import { defineTable, paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import { Doc, Id } from './_generated/dataModel'
import { internalMutation, mutation, query } from './_generated/server'
import { dimensions, generationStatus } from './constants'
import { get as getImageModel } from './imageModels'
import { Dimension } from './types'
import { assert, error, vEnum } from './util'

const generationsParameterFields = {
  imageModelId: v.id('imageModels'),
  prompt: v.string(),
  negativePrompt: v.optional(v.string()),
  seed: v.optional(v.number()),
  scheduler: v.optional(v.string()),
  steps: v.optional(v.number()),
  guidance: v.optional(v.number()),
  lcm: v.optional(v.boolean()),
}

const generationsOptions = {
  randomize: v.optional(v.boolean()),
}

const generationsEventFields = {
  status: vEnum(generationStatus),
  message: v.optional(v.string()),
  data: v.optional(v.any()),
}

const generationsInternalFields = {
  width: v.number(),
  height: v.number(),
  n: v.number(),

  userId: v.id('users'),
  imageIds: v.array(v.union(v.id('images'), v.null())),
  status: vEnum(generationStatus),
  events: v.array(v.object({ ...generationsEventFields, createdAt: v.number() })),
  deleted: v.boolean(),
}

export const generationsEnt = defineEnt({
  ...generationsParameterFields,
  ...generationsInternalFields,
})

export const page = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db.query('generations').order('desc').paginate(paginationOpts)

    const pageAndRelations = await Promise.all(
      result.page.map(async (generation) => ({
        generation,
        images: await Promise.all(
          generation.imageIds.map(async (id: Id<'images'> | null) =>
            id ? await ctx.db.get(id) : null,
          ),
        ),
        imageModel: await getImageModel(ctx, {
          id: generation.imageModelId,
        }),
        author: generation.userId ? await ctx.db.get(generation.userId) : null, //todo don't send all the personal data
      })),
    )

    return { ...result, page: pageAndRelations }
  },
})

export const get = query({
  args: { id: v.id('generations') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const run = internalMutation({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, { id }) => {
    const generation = await ctx.db.get(id)
    assert(generation, 'invalid generation id', { id })
    assert(generation.status === 'pending', 'invalid generation status', { generation })

    await ctx.db.patch(generation._id, {
      status: 'acting',
      events: [{ status: 'acting', createdAt: Date.now() }],
    })

    return { generation, imageModel: await ctx.db.get(generation.imageModelId) }
  },
})

const userMutation = customMutation(mutation, {
  args: {},
  input: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    assert(identity, 'Not logged in')

    const user = await ctx.db
      .query('users')
      .withIndex('token', (q) => q.eq('token', identity.tokenIdentifier))
      .unique()

    if (!user) {
      //? can crate user here, but should have already been created by frontend (?)
      throw error('Unregistered user')
    }

    return { ctx: { user }, args: {} }
  },
})

const getDimSize = (dim: Dimension) => {
  if (dim === 'portrait') return { width: 512, height: 768 }
  if (dim === 'square') return { width: 512, height: 512 }
  return { width: 768, height: 512 }
}

export const create = userMutation({
  args: {
    ...generationsParameterFields,
    dimensions: vEnum(dimensions),
    ...generationsOptions,
  },
  handler: async (ctx, { dimensions, ...args }) => {
    if (args.randomize)
      return await createRandom(ctx, { prompt: args.prompt, negativePrompt: args.negativePrompt })

    const { width, height } = getDimSize(dimensions)

    const id = await ctx.db.insert('generations', {
      ...args,
      width,
      height,
      n: 4,
      userId: ctx.user._id,
      imageIds: [],
      status: 'pending',
      events: [],
      deleted: false,
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
    imageIds: v.optional(v.array(v.union(v.id('images'), v.null()))),
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

//* mark generation and associate images as deleted
export const remove = mutation({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.id)
    assert(generation, 'invalid generation id', { id: args.id })

    //* markdelete images/files
    await Promise.all(
      generation.imageIds.map(async (id) => {
        if (!id) return
        const image = await ctx.db.get(id)
        if (!image) return
        await ctx.db.patch(image._id, { deleted: true })
      }),
    )

    //* markdelete generation
    await ctx.db.patch(generation._id, { deleted: true })
  },
})

//* hard delete generation and associated images
// TODO make internal
export const destroy = mutation({
  args: {
    id: v.id('generations'),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.id)
    assert(generation, 'invalid generation id', { id: args.id })

    //* delete images/files
    await Promise.all(
      generation.imageIds.map(async (id) => {
        if (!id) return
        const image = await ctx.db.get(id)
        if (!image) return
        await ctx.storage.delete(image.storageId)
        await ctx.db.delete(id)
      }),
    )

    //* delete generation
    await ctx.db.delete(generation._id)
  },
})

export const createRandom = internalMutation({
  args: {
    prompt: v.string(),
    negativePrompt: v.optional(v.string()),
  },
  handler: async (ctx, { prompt, negativePrompt }) => {
    const sizes = [
      { width: 512, height: 512 },
      { width: 768, height: 512 },
      { width: 512, height: 768 },
    ]

    const { width, height } = sizes[randomInt(3)]!

    const imagesModels = await ctx.db.query('imageModels').collect()
    const pick = imagesModels[randomInt(imagesModels.length)]!
    const user = (await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('admin'), true))
      .first())!

    const id = await ctx.db.insert('generations', {
      imageModelId: pick._id,
      prompt,
      negativePrompt,
      width,
      height,
      n: 4,
      userId: user._id,
      imageIds: [],
      status: 'pending',
      events: [],
      deleted: false,
    })

    //^ determine correct provider when we have more
    await ctx.scheduler.runAfter(0, internal.providers.sinkin.run, { id })
    return id
  },
})

const randomInt = (max: number) => Math.floor(Math.random() * max)
