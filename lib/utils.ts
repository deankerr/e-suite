import { clsx, type ClassValue } from 'clsx'
import pino from 'pino'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function getLocalStorage() {
  if (!isLocalStorageAvailable()) return undefined
  return window.localStorage
}

function isLocalStorageAvailable() {
  if (typeof window === 'undefined') return false
  try {
    localStorage.setItem('__e/suite_test_local__', 'doot')
    localStorage.removeItem('__e/suite_test_local__')
    return true
  } catch (e) {
    return false
  }
}
