import { v } from 'convex/values'

import { speechFields } from './schema'
import { generateSha256Hash } from './util'

import type { Doc, Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './types'
import type { Infer } from 'convex/values'

export type Speech = Doc<'speech'> & {
  url: string | null
}

const speechFieldsObject = v.object(speechFields)

export const getSpeech = async (ctx: QueryCtx, speechId?: Id<'speech'>) => {
  const speech = speechId ? await ctx.table('speech').get(speechId) : null
  if (!speech || speech.deletionTime) return null

  return {
    ...speech,
    url: speech.storageId ? await ctx.storage.getUrl(speech.storageId) : null,
  }
}

export const createSpeech = async (
  ctx: MutationCtx,
  fields: Omit<Infer<typeof speechFieldsObject>, 'textHash' | 'storageId'>,
) => {
  const textHash = await generateSha256Hash(fields.text)
  const speechId = await ctx.table('speech').insert({
    ...fields,
    textHash,
  })
  //todo job
  return speechId
}
