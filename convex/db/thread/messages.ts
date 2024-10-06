import { literals, nullable } from 'convex-helpers/validators'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { query } from '../../functions'
import { emptyPage, paginatedReturnFields } from '../../lib/utils'
import { getMessageEdges, messageReturnFields } from '../helpers/messages'
import { getThread } from '../helpers/threads'

export const get = query({
  args: {
    threadId: v.string(),
    series: v.number(),
  },
  handler: async (ctx, { threadId, series }) => {
    const thread = await getThread(ctx, threadId)
    if (!thread) return null

    const message = await ctx
      .table('messages', 'threadId_series', (q) =>
        q.eq('threadId', thread._id).eq('series', series),
      )
      .unique()

    return message ? await getMessageEdges(ctx, message) : null
  },
  returns: nullable(v.object(messageReturnFields)),
})

export const list = query({
  args: {
    threadId: v.string(),
    limit: v.optional(v.number()),
    order: v.optional(literals('asc', 'desc')),
  },
  handler: async (ctx, { threadId, limit = 20, order = 'desc' }) => {
    const thread = await getThread(ctx, threadId)
    if (!thread) return null

    const messages = await thread
      .edge('messages')
      .order(order)
      .take(limit)
      .map(async (message) => await getMessageEdges(ctx, message))
    return messages
  },
  returns: nullable(v.array(v.object(messageReturnFields))),
})

export const search = query({
  args: {
    threadId: v.string(),
    order: v.optional(literals('asc', 'desc')),
    role: v.optional(literals('system', 'assistant', 'user')),
    name: v.optional(v.string()),
    createdAfter: v.optional(v.number()),
    createdBefore: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (
    ctx,
    {
      threadId,
      order = 'desc',
      role,
      name,
      createdAfter = 10000,
      createdBefore = Infinity,
      paginationOpts,
    },
  ) => {
    const thread = await getThread(ctx, threadId)
    if (!thread) return emptyPage()

    paginationOpts.numItems = Math.min(paginationOpts.numItems, 5)

    const query =
      role && name
        ? ctx.table('messages', 'threadId_role_name', (q) =>
            q
              .eq('threadId', thread._id)
              .eq('role', role)
              .eq('name', name)
              .gt('_creationTime', createdAfter)
              .lt('_creationTime', createdBefore),
          )
        : role
          ? ctx.table('messages', 'threadId_role', (q) =>
              q
                .eq('threadId', thread._id)
                .eq('role', role)
                .gt('_creationTime', createdAfter)
                .lt('_creationTime', createdBefore),
            )
          : name
            ? ctx.table('messages', 'threadId_name', (q) =>
                q
                  .eq('threadId', thread._id)
                  .eq('name', name)
                  .gt('_creationTime', createdAfter)
                  .lt('_creationTime', createdBefore),
              )
            : ctx.table('messages', 'threadId', (q) =>
                q
                  .eq('threadId', thread._id)
                  .gt('_creationTime', createdAfter)
                  .lt('_creationTime', createdBefore),
              )

    const messages = await query
      .order(order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .paginate(paginationOpts)
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
  returns: v.object({ ...paginatedReturnFields, page: v.array(v.object(messageReturnFields)) }),
})

export const searchText = query({
  args: {
    threadId: v.string(),
    text: v.string(),
    role: v.optional(literals('system', 'assistant', 'user')),
    name: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { threadId, text, role, name, limit = 20 }) => {
    const thread = await getThread(ctx, threadId)
    if (!thread) return []

    const messages = await ctx
      .table('messages')
      .search('search_text_threadId_role_name', (q) => {
        const query = q.search('text', text).eq('threadId', thread._id)
        if (role && name) return query.eq('role', role).eq('name', name)
        if (role) return query.eq('role', role)
        if (name) return query.eq('name', name)
        return query
      })
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(Math.min(limit, 50))
      .map(async (message) => await getMessageEdges(ctx, message))

    return messages
  },
  returns: v.array(v.object(messageReturnFields)),
})
