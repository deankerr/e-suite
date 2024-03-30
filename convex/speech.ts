import { v } from 'convex/values'
import { deepEqual } from 'fast-equals'

import { internalMutation, internalQuery } from './functions'
import { getJobStatus } from './jobs'
import { generateSha256Hash } from './util'
import { runAction } from './utils/retrier'
import { getVoiceRefParameters } from './voices'

import type { Doc, Id } from './_generated/dataModel'
import type { JobStatus, MutationCtx, QueryCtx } from './types'

export type Speech = Doc<'speech'> & {
  url: string | null
  status: JobStatus
}

export const getSpeech = async (ctx: QueryCtx, speechId?: Id<'speech'>): Promise<Speech | null> => {
  const speech = speechId ? await ctx.table('speech').get(speechId) : null
  if (!speech || speech.deletionTime) return null

  return {
    ...speech,
    url: speech.storageId ? await ctx.storage.getUrl(speech.storageId) : null,
    status: await getJobStatus(ctx, speech?.jobId),
  }
}

export const get = internalQuery({
  args: {
    id: v.id('speech'),
  },
  handler: async (ctx, { id }) => await getSpeech(ctx, id),
})

export const createSpeech = async (
  ctx: MutationCtx,
  { text: rawText, voiceRef }: { text: string; voiceRef: string },
) => {
  const text = replaceUrlText(rawText)
  const parameters = getVoiceRefParameters(voiceRef)
  const textHash = await generateSha256Hash(text)

  // link existing storageId if match found
  const matches = await ctx.table('speech', 'textHash_voiceRef', (q) =>
    q.eq('textHash', textHash).eq('voiceRef', voiceRef),
  )
  for (const match of matches) {
    if (match.storageId && deepEqual(match.parameters, parameters)) {
      return await ctx
        .table('speech')
        .insert({ text, textHash, voiceRef, parameters, storageId: match.storageId })
    }
  }

  // create new speech
  const speech = await ctx
    .table('speech')
    .insert({
      text,
      textHash,
      voiceRef,
      parameters,
    })
    .get()

  const jobId = await runAction(ctx, {
    action: `providers/${parameters.provider}:textToSpeech`,
    actionArgs: { speechId: speech._id },
  })

  await speech.patch({ jobId })

  return speech._id
}

export const updateStorageId = internalMutation({
  args: {
    id: v.id('speech'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { id, storageId }) =>
    await ctx.table('speech').getX(id).patch({ storageId }),
})

// replace url substrings with a shortened version
const replaceUrlText = (text: string) => {
  const urlRegex =
    /\S([a-z]{1,2}tps?):\/\/((?:(?!(?:\/|#|\?|&))\S)+)(?:(\/(?:(?:(?:(?!(?:#|\?|&))\S)+\/))?))?(?:((?:(?!(?:\.|$|\?|#))\S)+))?(?:(\.(?:(?!(?:\?|$|#))\S)+))?(?:(\?(?:(?!(?:$|#))\S)+))?(?:(#\S+))?\S/g
  let newText = text

  const matches = newText.matchAll(urlRegex)
  for (const match of matches) {
    const [url, _protocol, main] = match
    newText = newText.replace(url, `URL: ${main}`)
  }

  return newText
}
