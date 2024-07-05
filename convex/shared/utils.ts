import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { Doc } from '../_generated/dataModel'

import type { ChatCompletionConfig, InferenceConfig, TextToImageConfig } from '../types'
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

export const getErrorMessage = (err: unknown) => {
  if (err instanceof ConvexError) {
    return err.message
  }

  if (err instanceof Error) {
    return err.message
  }

  return `Unknown error: ${String(err).slice(0, 100)}`
}

export const hasActiveJobName = (jobs: Doc<'jobs'>[], name: string) => {
  return jobs.filter((j) => j.name === name).some((j) => ['active', 'queued'].includes(j.status))
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

//* zod utils
export const zTruncate = (max: number, min = 0) =>
  z
    .string()
    .min(min)
    .transform((value) => value.slice(0, max))

export const zThreadTitle = zTruncate(256, 1)
export const zMessageName = zTruncate(64)
export const zMessageTextContent = zTruncate(32767)
export const zStringToMessageRole = z
  .string()
  .transform((value) => z.enum(['user', 'assistant', 'system']).parse(value))

export const getChatConfig = (inference?: InferenceConfig): ChatCompletionConfig | null => {
  return inference?.type === 'chat-completion' ? inference : null
}

export const getTextToImageConfig = (inference?: InferenceConfig): TextToImageConfig | null => {
  return inference?.type === 'text-to-image' ? inference : null
}
