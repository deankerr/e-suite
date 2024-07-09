import { literals } from 'convex-helpers/validators'
import { v } from 'convex/values'

import { Doc, Id } from '../_generated/dataModel'
import { internalMutation, internalQuery, query } from '../functions'
import { MutationCtx, QueryCtx } from '../types'

export const generateSpeech = async (
  ctx: MutationCtx,
  args: { text: string; textHash: string; resourceKey: string },
) => {
  const existingSpeechFile = await ctx
    .table('speech', 'textHash_resourceKey', (q) =>
      q.eq('textHash', args.textHash).eq('resourceKey', args.resourceKey),
    )
    .first()
  if (existingSpeechFile) {
    console.log('existing speech', existingSpeechFile.resourceKey, existingSpeechFile.textHash)
    return existingSpeechFile._id
  }

  // const speechFileId = await ctx.table('speech').insert({
  //   textHash: args.textHash,
  //   resourceKey: args.resourceKey,
  // })

  // await ctx.scheduler.runAfter(0, internal.inference.textToSpeech.runNow, {
  //   speechFileId,
  //   text: args.text,
  //   textHash: args.textHash,
  //   resourceKey: args.resourceKey,
  // })

  // return speechFileId
}

export const getSpeechFile = async (ctx: QueryCtx, speechFileId: Id<'speech'>) => {
  const speechFile = await ctx.table('speech').get(speechFileId)
  if (speechFile) {
    const url = speechFile.fileId ? await ctx.storage.getUrl(speechFile.fileId) : ''
    return { ...speechFile, url }
  }
}

const statusV = literals('pending', 'complete', 'error')
export const update = internalMutation({
  args: {
    speechFileId: v.id('speech'),
    status: statusV,
    fileId: v.optional(v.id('_storage')),
    fileUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { speechFileId, fileId }) => {
    return await ctx.table('speech').getX(speechFileId).patch({ fileId })
  },
})

export const get = internalQuery({
  args: {
    textHash: v.string(),
    resourceKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx
      .table('speech', 'textHash_resourceKey', (q) =>
        q.eq('textHash', args.textHash).eq('resourceKey', args.resourceKey),
      )
      .uniqueX()
  },
})

export const getById = query({
  args: {
    speechFileId: v.id('speech'),
  },
  handler: async (ctx, args) => {
    return await ctx.table('speech').get(args.speechFileId)
  },
})
