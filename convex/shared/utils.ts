import { pick } from 'convex-helpers'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import type { Doc } from '../_generated/dataModel'
import type { EMessage } from './types'
import type { Value } from 'convex/values'

export function insist<T>(
  condition: T,
  message: string,
  data?: Record<string, Value>,
): asserts condition {
  if (!condition)
    throw new ConvexError({ ...data, message: `assertion failed: ${message}`, fatal: true })
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

export function createMessageShape(message: Doc<'messages'>): EMessage {
  return pick(message, [
    '_id',
    '_creationTime',
    'threadId',
    'role',
    'name',
    'content',
    'inference',
    'series',
    'userId',
  ])
}

//* zod utils
export const zTruncate = (max: number, min = 0) =>
  z
    .string()
    .min(min)
    .transform((value) => value.slice(0, max))

export const zThreadTitle = zTruncate(256, 1)
export const zMessageName = zTruncate(64)
export const zMessageTextContent = zTruncate(32767)
