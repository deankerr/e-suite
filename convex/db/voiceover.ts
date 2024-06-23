import { z } from 'zod'

import { mutation } from '../functions'
import { hasActiveJobName, insist } from '../shared/utils'
import { generateSha256Hash } from '../utils'
import { getMessage, getMessageJobs } from './messages'
import { generateSpeech } from './speechFiles'
import { getVoiceModels } from './voiceModels'

const fallbackResourceKey = 'openai::alloy'

export const messageContent = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    insist(message, 'invalid message id')
    insist(!message.voiceover, 'voiceover already exists')

    const originalText = message.content
    insist(originalText, 'invalid message content')

    // check for text generation in progress
    const jobs = await getMessageJobs(ctx, message)
    insist(!hasActiveJobName(jobs, 'inference/chat-completion'), 'text generation in progress')

    const processedText = replaceUrlsWithDetails(originalText)

    const textHash = await generateSha256Hash(processedText)
    const thread = await message.edgeX('thread')
    let resourceKey = thread.voiceovers?.default ?? fallbackResourceKey

    // TODO: extract to function
    if (message.name) {
      const voiceover = thread.voiceovers?.names?.find((n) => n.name === message.name)
      if (voiceover?.resourceKey) {
        resourceKey = voiceover.resourceKey
      } else {
        // * choose a random unassigned resource key if the name is not found
        const assignedVoices = thread.voiceovers?.names?.map((n) => n.resourceKey) ?? []
        const voices = getVoiceModels().filter(
          (voice) => voice.endpoint !== 'elevenlabs' && !assignedVoices.includes(voice.resourceKey),
        )
        resourceKey =
          voices[Math.floor(Math.random() * voices.length)]?.resourceKey ?? fallbackResourceKey

        await ctx.skipRules
          .table('threads')
          .getX(thread._id)
          .patch({
            voiceovers: {
              ...thread.voiceovers,
              default: thread.voiceovers?.default ?? fallbackResourceKey,
              names: [...(thread.voiceovers?.names ?? []), { name: message.name, resourceKey }],
            },
          })

        console.log('added voiceover:', message.name, resourceKey)
      }
    }

    const speechFileId = await generateSpeech(ctx, {
      text: processedText,
      textHash,
      resourceKey,
    })
    // TODO remove this relation
    await ctx.skipRules.table('messages').getX(message._id).patch({
      voiceover: {
        textHash,
        resourceKey,
        speechFileId,
      },
    })
  },
})

export const text = mutation({
  args: {
    text: z.string(),
    resourceKey: z.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.viewer()
    insist(user?.role === 'admin', 'not authorized')
    insist(args.text && args.resourceKey, 'invalid input')

    const textHash = await generateSha256Hash(args.text)
    const speechFileId = await generateSpeech(ctx, {
      text: args.text,
      textHash,
      resourceKey: args.resourceKey,
    })

    return speechFileId
  },
})

export const remove = mutation({
  args: {
    messageId: z.string(),
  },
  handler: async (ctx, args) => {
    const message = await getMessage(ctx, args.messageId)
    insist(message, 'invalid message id')
    insist(message.voiceover?.speechFileId, 'invalid message id')

    const speechFile = await ctx.table('speech_files').getX(message.voiceover.speechFileId)
    await ctx
      .table('messages', 'speechId')
      .filter((q) => q.eq(q.field('voiceover.speechFileId'), speechFile._id))
      .map((m) => m.patch({ voiceover: undefined }))

    if (speechFile.fileId) await ctx.storage.delete(speechFile.fileId)
    await speechFile.delete()
  },
})

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
