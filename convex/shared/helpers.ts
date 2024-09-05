import type { EMessage } from '../types'

export function getMessageName(message: EMessage) {
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  if (message.role === 'system') return 'System'
  return 'Assistant'
}

export const getMaxQuantityForModel = (resourceKey: string) => {
  const maxQuantities: Record<string, number> = {
    'fal::fal-ai/aura-flow': 2,
    'fal::fal-ai/flux-pro': 1,
  }

  return maxQuantities[resourceKey] ?? 4
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
