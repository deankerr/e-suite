import { ConvexError, v, Validator } from 'convex/values'

import type { Value } from 'convex/values'

export const vEnum = <const T extends ReadonlyArray<string>>(
  values: T,
): Validator<T[number], false, never> => {
  //@ts-expect-error this should be allowed
  return v.union(...values.map((e) => v.literal(e)))
}

export const raise = (message: string): never => {
  throw new Error(message)
}

export function assert<T>(
  condition: T,
  message: string,
  data?: Record<string, unknown>,
): asserts condition {
  if (!condition) throw error(message, data)
}

export const error = (message: string, data?: Record<string, unknown>) => {
  return new ConvexError({ ...data, message })
}

export const generateSha256Hash = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export const createError = (info: { message: string; isOperational: boolean; data?: Value }) => {
  return new ConvexError(info)
}
