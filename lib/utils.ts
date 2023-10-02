import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  depthLimit: 2,
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
})

export function raise(message: string): never {
  throw new Error(message)
}

export function env(key: string, fallback?: string) {
  return process.env[key] ?? fallback ?? raise(`${key} not provided`)
}
