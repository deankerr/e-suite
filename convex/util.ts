import { ConvexError, v, Validator } from 'convex/values'

import type { Value } from 'convex/values'

export const vEnum = <const T extends ReadonlyArray<string>>(
  values: T,
): Validator<T[number], false, never> => {
  //@ts-expect-error this should be allowed
  return v.union(...values.map((e) => v.literal(e)))
}

export function insist<T>(condition: T, data: Value): asserts condition {
  if (!condition) throw new ConvexError(data)
}

export const generateSha256Hash = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
