import { ConvexError } from 'convex/values'

import type { Value } from 'convex/values'

export function insist<T>(condition: T, message: string, data?: Value): asserts condition {
  if (!condition) throw new ConvexError(data ? { message: `insist: ${message}`, data } : message)
}

export function env(name: string) {
  const value = process.env[name]
  insist(value, `Environment variable is undefined: ${name}`)
  return value
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
