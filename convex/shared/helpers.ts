import type { Doc } from '../_generated/dataModel'
import type {
  ChatCompletionConfig,
  EMessage,
  InferenceConfig,
  TextToAudioConfig,
  TextToImageConfig,
} from '../types'

export function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = extractInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) {
    const modelName = message.images[0]?.generationData?.modelName
    return modelName ?? textToImageConfig.endpointModelId
  }
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}

export function getMessageText(message: EMessage) {
  if (message.text) return message.text

  const { textToImageConfig, textToAudioConfig } = extractInferenceConfig(message.inference)
  return textToImageConfig?.prompt ?? textToAudioConfig?.prompt
}

export function extractInferenceConfig(inference: InferenceConfig | undefined): {
  chatConfig: ChatCompletionConfig | null
  textToImageConfig: TextToImageConfig | null
  textToAudioConfig: TextToAudioConfig | null
} {
  return {
    chatConfig: inference?.type === 'chat-completion' ? inference : null,
    textToImageConfig: inference?.type === 'text-to-image' ? inference : null,
    textToAudioConfig: inference?.type === 'sound-generation' ? inference : null,
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
