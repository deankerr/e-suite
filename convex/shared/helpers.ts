import type { EMessage, RunConfigChat, RunConfigTextToAudio, RunConfigTextToImage } from '../types'

export function getMessageName(message: EMessage) {
  if (message.name) return message.name

  const { textToImageConfig, textToAudioConfig } = extractRunConfig(message.jobs)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) {
    const modelName = message.images[0]?.generationData?.modelName
    return modelName ?? textToImageConfig.resourceKey
  }

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

export const getMaxQuantityForModel = (resourceKey: string) => {
  const maxQuantities: Record<string, number> = {
    'fal::fal-ai/aura-flow': 2,
    'fal::fal-ai/flux-pro': 1,
  }

  return maxQuantities[resourceKey] ?? 4
}

const runConfigNames = ['chat', 'textToImage', 'textToAudio'] as const
export function extractRunConfig(jobs: EMessage['jobs']): {
  chatConfig: RunConfigChat | null
  textToImageConfig: RunConfigTextToImage | null
  textToAudioConfig: RunConfigTextToAudio | null
} {
  const runConfigJob = jobs.find((job) =>
    runConfigNames.includes(job.name as (typeof runConfigNames)[number]),
  )

  if (!runConfigJob || typeof runConfigJob.input !== 'object') {
    return {
      chatConfig: null,
      textToImageConfig: null,
      textToAudioConfig: null,
    }
  }

  switch (runConfigJob.name) {
    case 'chat':
      return {
        chatConfig: runConfigJob.input as RunConfigChat,
        textToImageConfig: null,
        textToAudioConfig: null,
      }
    case 'textToImage':
      return {
        chatConfig: null,
        textToImageConfig: runConfigJob.input as RunConfigTextToImage,
        textToAudioConfig: null,
      }
    case 'textToAudio':
      return {
        chatConfig: null,
        textToImageConfig: null,
        textToAudioConfig: runConfigJob.input as RunConfigTextToAudio,
      }
    default:
      return {
        chatConfig: null,
        textToImageConfig: null,
        textToAudioConfig: null,
      }
  }
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
