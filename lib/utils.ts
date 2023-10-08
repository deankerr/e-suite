import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  depthLimit: 2,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['base64', 'image_url'],
})

const truncateLength = 40
function truncateLogString(obj: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (key in obj && typeof obj[key] === 'string') {
      const value = obj[key] as string
      if (value.length > truncateLength) {
        obj[key] = value.slice(0, truncateLength) + ' ... [TRUNCATED]'
      }
    }
  }
}

export function raise(message: string): never {
  throw new Error(message)
}

export function env(key: string, fallback?: string) {
  return process.env[key] ?? fallback ?? raise(`${key} not provided`)
}

export function isFriendly(value: string | null) {
  if (!value || value !== 'yes sir') {
    console.error('value:', value)
    return false
  }
  return true
}
