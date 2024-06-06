import { asyncMap, pick } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'
import { fileAttachmentRecordWithContentSchema } from '../shared/structures'

import type { E_Message } from '../shared/types'
import type { Ent, QueryCtx } from '../types'

const messageShape = (message: Ent<'messages'>): E_Message =>
  pick(message, [
    '_id',
    '_creationTime',
    'threadId',
    'role',
    'name',
    'content',
    'inference',
    'series',
    'userId',
  ])

const getFileAttachmentContent = async (ctx: QueryCtx, files?: Ent<'messages'>['files']) => {
  if (!files) return undefined
  const filesWithContent = await asyncMap(files, async (file) => {
    if (file.type === 'image') {
      return {
        ...file,
        image: await ctx.table('images').get(file.id),
      }
    }

    return file
  })
  // ? replace
  return fileAttachmentRecordWithContentSchema.array().parse(filesWithContent)
}

export const list = query({
  args: {
    threadId: z.string(),
    limit: z.number().max(200).default(50),
    order: z.enum(['asc', 'desc']).default('desc'),
  },
  handler: async (ctx, args): Promise<E_Message[]> => {
    const threadId = ctx.unsafeDb.normalizeId('threads', args.threadId)
    if (!threadId) return []

    const messages = await ctx
      .table('messages', 'threadId', (q) => q.eq('threadId', threadId))
      .order(args.order)
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .take(args.limit)
      .map(async (message) => {
        const shape = messageShape(message)
        const files = await getFileAttachmentContent(ctx, message.files)
        return { ...shape, files }
      })

    return messages.reverse()
  },
})
