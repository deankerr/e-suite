import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from './_generated/api'
import { slugIdLength } from './constants'
import { mutation, query } from './functions'
import { textToImageModels } from './generation'
import { generateRandomString, zPaginationOptValidator } from './lib/utils'
import { generationFields, messageFields } from './schema'
import { runWithRetries } from './utils'

import type { MutationCtx, QueryCtx } from './types'

const generateSlugId = async (ctx: MutationCtx): Promise<string> => {
  const slugId = generateRandomString(slugIdLength)
  const existing = await ctx.table('messages', 'slugId', (q) => q.eq('slugId', slugId)).first()
  return existing ? generateSlugId(ctx) : slugId
}

const { width, height, n, ...parameters } = generationFields
const generationArgs = z.object({
  parameters: z.object(parameters),
  dimensions: z
    .object({ width, height, n: n.min(1).max(4) })
    .array()
    .min(1)
    .max(4),
})

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    generation: generationArgs.optional(),
  },
  handler: async (ctx, { threadId, message, generation }) => {
    const slugId = await generateSlugId(ctx)
    const messageId = await ctx.table('messages').insert({ threadId, ...message, slugId })

    if (generation) {
      await Promise.all(
        generation.dimensions.map(async (dimension) => {
          const generationId = await ctx
            .table('generations')
            .insert({ ...generation.parameters, ...dimension, messageId })

          await runWithRetries(ctx, internal.generation.textToImage, { generationId })
        }),
      )
    }

    return messageId
  },
})

export const get = query({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.table('messages').getX(messageId)
    return message
  },
})

const getMessageWithEdges = async (ctx: QueryCtx, { slugId }: { slugId: string }) => {
  const message = await ctx.table('messages', 'slugId', (q) => q.eq('slugId', slugId)).first()
  if (!message) return null

  const thread = await message.edge('thread')
  const generations = await message.edge('generations').map(async (generation) => ({
    ...generation,
    model: textToImageModels.find((model) => model.id === generation.model_id)?.name,
    generated_images: await generation.edge('generated_images'),
  }))

  const title = generations[0]?.prompt
    ? generations[0]?.prompt
    : `Message from ${message?.name ?? message.role}`

  return { message, thread, generations, title }
}

export const getMetadata = query({
  args: {
    slugId: z.string(),
  },
  handler: async (ctx, { slugId }) => {
    const message = await ctx.table('messages', 'slugId', (q) => q.eq('slugId', slugId)).first()
    if (!message) return null

    const generations = await message.edge('generations')

    const title = generations[0]?.prompt
      ? generations[0]?.prompt
      : `Message from ${message?.name ?? message.role}`

    return { title }
  },
})

export const getBySlugId = query({
  args: {
    slugId: z.string(),
  },
  handler: async (ctx, args) => await getMessageWithEdges(ctx, args),
})

export const list = query({
  args: {
    threadId: zid('threads'),
    order: z.enum(['asc', 'desc']).default('asc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { threadId, order, paginationOpts }) => {
    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (message) => ({
        ...message,
        generations: await message.edge('generations').map(async (generation) => ({
          ...generation,
          model: textToImageModels.find((model) => model.id === generation.model_id)?.name,
          generated_images: await generation.edge('generated_images'),
        })),
      }))

    return messages
  },
})

export const listEdges = query({
  args: {
    threadId: zid('threads'),
    order: z.enum(['asc', 'desc']).default('asc'),
    paginationOpts: zPaginationOptValidator,
  },
  handler: async (ctx, { threadId, order, paginationOpts }) => {
    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (message) => ({
        message,
        generations: await message.edge('generations').map(async (generation) => ({
          generation,
          model: textToImageModels.find((model) => model.id === generation.model_id),
          generated_images: await generation.edge('generated_images'),
        })),
      }))

    return messages
  },
})

export const remove = mutation({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.table('messages').getX(messageId).delete()
  },
})
