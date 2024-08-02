import { ConvexError } from 'convex/values'

import type { Doc } from '../_generated/dataModel'
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

// from convex/values
export function stringifyValueForError(value: any) {
  if (typeof value === 'string') return value

  return JSON.stringify(value, (_key, value) => {
    if (value === undefined) {
      // By default `JSON.stringify` converts undefined, functions, symbols, Infinity, and NaN to null which produces a confusing error message.
      // We deal with `undefined` specifically because it's the most common.
      return 'undefined'
    }
    if (typeof value === 'bigint') {
      // `JSON.stringify` throws on bigints by default.
      return `${value.toString()}n`
    }
    return value
  })
}

export function getMessageJobsDetails(jobs: Doc<'jobs3'>[]) {
  const active = jobs.filter((job) => job.status === 'active' || job.status === 'pending')
  const failed = jobs.filter((job) => job.status === 'failed')
  const failedJobErrors = failed
    .map((job) => job.stepResults.at(-1)?.error)
    .filter((err) => err !== undefined)

  return { active, failed, failedJobErrors }
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
