import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
  ChatCompletionConfig,
  InferenceConfig,
  TextToAudioConfig,
  TextToImageConfig,
} from '@/convex/types'
import type { ClassValue } from 'clsx'

export type { ClassNameValue } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getEnvironment() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return 'prod'
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return 'prev'
  if (process.env.NODE_ENV === 'development') return 'dev'
  return 'prod'
}
export const environment = getEnvironment()

export function getConvexSiteUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is undefined')
  return convexUrl.replace('.cloud', '.site')
}

export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

export function stringToHex(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

export function stringHashToListItem<T>(str: string, list: T[]): T {
  if (list.length === 0) {
    throw new Error('The provided list is empty')
  }

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  hash = Math.abs(hash)

  const index = hash % list.length
  return list[index] as T
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
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
