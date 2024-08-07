import { RunConfigChat, RunConfigTextToAudio, RunConfigTextToImage } from '../types'

import type { Doc } from '../_generated/dataModel'
import type { EMessage } from '../types'

export function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = extractRunConfig(message.jobs)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) {
    const modelName = message.images[0]?.generationData?.modelName
    return modelName ?? textToImageConfig.resourceKey
  }
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}

export function getMessageText(message: EMessage) {
  if (message.text) return message.text

  const { textToImageConfig, textToAudioConfig } = extractRunConfig(message.jobs)
  return textToImageConfig?.prompt ?? textToAudioConfig?.prompt
}

export const isSameAuthor = (...messages: (EMessage | undefined)[]) => {
  const firstMessage = messages.at(0)
  if (!firstMessage) return false
  return messages.every(
    (message) => message?.name === firstMessage.name && message?.role === firstMessage.role,
  )
}

const runConfigNames = ['chat', 'textToImage', 'textToAudio'] as const
export function extractRunConfig(jobs: Doc<'jobs3'>[]): {
  chatConfig: RunConfigChat | null
  textToImageConfig: RunConfigTextToImage | null
  textToAudioConfig: RunConfigTextToAudio | null
} {
  const relevantJob = jobs.find((job) =>
    runConfigNames.includes(job.pipeline as (typeof runConfigNames)[number]),
  )

  if (!relevantJob || typeof relevantJob.input !== 'object') {
    return {
      chatConfig: null,
      textToImageConfig: null,
      textToAudioConfig: null,
    }
  }

  switch (relevantJob.pipeline) {
    case 'chat':
      return {
        chatConfig: relevantJob.input as RunConfigChat,
        textToImageConfig: null,
        textToAudioConfig: null,
      }
    case 'textToImage':
      return {
        chatConfig: null,
        textToImageConfig: relevantJob.input as RunConfigTextToImage,
        textToAudioConfig: null,
      }
    case 'textToAudio':
      return {
        chatConfig: null,
        textToImageConfig: null,
        textToAudioConfig: relevantJob.input as RunConfigTextToAudio,
      }
    default:
      return {
        chatConfig: null,
        textToImageConfig: null,
        textToAudioConfig: null,
      }
  }
}

export function extractJobsDetails(jobs: Doc<'jobs3'>[]) {
  const active = jobs.filter((job) => job.status === 'active' || job.status === 'pending')
  const failed = jobs.filter((job) => job.status === 'failed')
  const failedJobErrors = failed
    .map((job) => job.stepResults.at(-1)?.error)
    .filter((err) => err !== undefined)

  return { active, failed, failedJobErrors }
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function extractValidUrlsFromText(text: string): URL[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex) || []
  return matches
    .map((url) => {
      try {
        return new URL(url)
      } catch {
        return null
      }
    })
    .filter((url): url is URL => url !== null)
}

export function hasDelimiter(text: string) {
  return (
    text.includes('\n') ||
    text.includes('.') ||
    text.includes('?') ||
    text.includes('!') ||
    text.includes(',') ||
    text.length > 100
  )
}
