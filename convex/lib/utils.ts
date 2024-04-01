import { ConvexError } from 'convex/values'
import { customAlphabet } from 'nanoid'

import type { Value } from 'convex/values'

export const getEnv = (prop: string) => {
  const env = process.env[prop]
  insist(env, `Unable to get ${prop}`)
  return env
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

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}
