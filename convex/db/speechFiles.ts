import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { Doc, Id } from '../_generated/dataModel'
import { internalMutation, internalQuery } from '../functions'
import { MutationCtx, QueryCtx } from '../types'

export const generateSpeech = async (
  ctx: MutationCtx,
  args: { text: string; textHash: string; resourceKey: string },
) => {
  const existingSpeechFile = await ctx
    .table('speech_files', 'textHash_resourceKey', (q) =>
      q.eq('textHash', args.textHash).eq('resourceKey', args.resourceKey),
    )
    .first()
  if (existingSpeechFile) return existingSpeechFile._id

  const speechFileId = await ctx.table('speech_files').insert({
    textHash: args.textHash,
    resourceKey: args.resourceKey,
    status: 'pending',
    updatedAtTime: Date.now(),
  })

  await ctx.scheduler.runAfter(0, internal.inference.textToSpeech.runNow, {
    speechFileId,
    text: args.text,
    textHash: args.textHash,
    resourceKey: args.resourceKey,
  })

  return speechFileId
}

export const getSpeechFile = async (
  ctx: QueryCtx,
  speechFileId: Id<'speech_files'>,
): Promise<Doc<'speech_files'> | undefined> => {
  const speechFile = await ctx.table('speech_files').get(speechFileId)
  return speechFile ?? undefined
}

export const update = internalMutation({
  args: {
    speechFileId: zid('speech_files'),
    status: z.enum(['pending', 'complete', 'error']),
    fileId: zid('_storage').optional(),
    fileUrl: z.string().optional(),
    error: z.string().optional(),
  },
  handler: async (ctx, { speechFileId, ...args }) => {
    return await ctx
      .table('speech_files')
      .getX(speechFileId)
      .patch({ ...args, updatedAtTime: Date.now() })
  },
})

export const get = internalQuery({
  args: {
    textHash: z.string(),
    resourceKey: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('speech_files', 'textHash_resourceKey', (q) =>
        q.eq('textHash', args.textHash).eq('resourceKey', args.resourceKey),
      )
      .uniqueX()
  },
})
