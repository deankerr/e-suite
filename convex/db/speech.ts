import { v } from 'convex/values'

import { mutation, query } from '../functions'
import { createJob } from '../jobs'
import { hasActiveJob, insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'
import { getMessage, getMessageJobs } from './messages'

const fallbackResourceKey = 'openai::alloy'

export const messageText = mutation({
  args: {
    messageId: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    const originalText = message?.text
    insist(message && originalText, 'invalid message id')

    const jobs = await getMessageJobs(ctx, message._id)
    insist(!hasActiveJob(jobs), 'message jobs in progress')

    const processedText = replaceUrlsWithDetails(originalText)
    const textHash = await generateSha256Hash(processedText)

    const thread = await message.edgeX('thread')

    const assignedVoice = message.name
      ? thread.voiceovers?.names?.find((n) => n.name === message.name)?.resourceKey
      : undefined
    const resourceKey = assignedVoice ?? thread.voiceovers?.default ?? fallbackResourceKey

    const existingSpeechFile = await ctx
      .table('speech', 'textHash_resourceKey', (q) =>
        q.eq('textHash', textHash).eq('resourceKey', resourceKey),
      )
      .first()
    if (existingSpeechFile) {
      console.log('existing speech', existingSpeechFile.resourceKey, existingSpeechFile.textHash)
      return existingSpeechFile._id
    }

    const speechId = await ctx.table('speech').insert({
      textHash,
      resourceKey,
    })

    await createJob(ctx, {
      name: 'inference/textToSpeech',
      fields: {
        speechId,
        text: processedText,
        resourceKey,
      },
    })

    return speechId
  },
})

export const get = query({
  args: {
    speechId: v.id('speech'),
  },
  handler: async (ctx, args) => {
    const speech = await ctx.table('speech').get(args.speechId)
    if (!speech) return null

    const fileUrl = speech?.fileId ? await ctx.storage.getUrl(speech.fileId) : undefined
    return { ...speech, fileUrl }
  },
})

// * text processing
export const getUrlDetails = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = text.match(urlRegex)
  if (!urls) return []

  return urls
    .map((url) => {
      try {
        const urlObj = new URL(url)
        const hostname = urlObj.hostname
        const fileType = urlObj.pathname.includes('.')
          ? urlObj.pathname.split('.').pop()
          : undefined
        return { url, hostname, fileType }
      } catch (error) {
        console.error('Invalid URL:', url)
        return null
      }
    })
    .filter(
      (result): result is { url: string; hostname: string; fileType: string | undefined } =>
        result !== null,
    )
}

export const replaceUrlsWithDetails = (text: string): string => {
  const urls = getUrlDetails(text)
  let result = text

  urls.forEach(({ url, hostname, fileType }) => {
    const replacement = fileType ? `(URL: ${hostname} , ${fileType})` : `(URL: ${hostname})`
    result = result.replace(url, replacement)
  })

  return result.trim()
}
