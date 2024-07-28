import { ConvexError } from 'convex/values'

import { Doc } from '../_generated/dataModel'

import type {
  ChatCompletionConfig,
  InferenceConfig,
  TextToAudioConfig,
  TextToImageConfig,
} from '../types'
import type { Value } from 'convex/values'

export function env(name: string) {
  const value = process.env[name]
  insist(value, `Environment variable is undefined: ${name}`)
  return value
}

export function createError(
  message: string,
  {
    fatal = false,
    code = 'unhandled',
    data,
  }: { fatal?: boolean; code?: string; data?: Record<string, Value> } = {},
) {
  return new ConvexError({ message, fatal, code, data })
}

export function insist<T>(
  condition: T,
  message: string,
  data?: Record<string, Value>,
): asserts condition {
  if (!condition)
    throw new ConvexError({ ...data, message: `assertion failed: ${message}`, fatal: true })
}

export function getErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  console.error('Unable to get error message for error', error)
  return 'Unknown Error'
}

export function hasActiveJob(jobs: Doc<'jobs'>[], name?: string) {
  return jobs
    .filter((j) => (name ? j.name === name : true))
    .some((j) => ['active', 'queued'].includes(j.status))
}

export function getActiveJobs(jobs: Doc<'jobs'>[]) {
  return jobs.filter((j) => ['active', 'queued'].includes(j.status))
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

export function getChatConfig(inference?: InferenceConfig): ChatCompletionConfig | null {
  return inference?.type === 'chat-completion' ? inference : null
}

export function getTextToImageConfig(inference?: InferenceConfig): TextToImageConfig | null {
  return inference?.type === 'text-to-image' ? inference : null
}

export function getTextToAudioConfig(inference?: InferenceConfig): TextToAudioConfig | null {
  return inference?.type === 'sound-generation' ? inference : null
}

export function getInferenceConfig(inference?: InferenceConfig) {
  const base = {
    chatConfig: getChatConfig(inference),
    textToImageConfig: getTextToImageConfig(inference),
    textToAudioConfig: getTextToAudioConfig(inference),
  }

  return base
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
