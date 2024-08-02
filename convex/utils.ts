import { makeActionRetrier } from 'convex-helpers/server/retries'
import { customAlphabet } from 'nanoid/non-secure'
import { z } from 'zod'

import type { MutationCtx } from './types'

export const { runWithRetries, retry } = makeActionRetrier('utils:retry')

// see https://github.com/xixixao/saas-starter/blob/main/convex/utils.ts
// permanent loading state for a paginated query until a different result is returned
export function emptyPage() {
  return {
    page: [],
    isDone: false,
    continueCursor: '',
    pageStatus: 'SplitRequired' as const,
  }
}

export const generateSlug = async (ctx: MutationCtx) => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')

  async function getAvailableSlug(): Promise<string> {
    const slug = nanoid(8)
    const existing = await ctx.table('threads', 'slug', (q) => q.eq('slug', slug)).first()
    return existing ? await getAvailableSlug() : slug
  }

  return await getAvailableSlug()
}

export const generateRandomString = (length: number) => {
  const generate = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
  return generate(length)
}

export const generateSha256Hash = async (input: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const uidMagic = 1627826378900 // turn back time to reduce the size of the uid
export const generateUid = (number: number): string => {
  return base36Encode(Math.trunc(number) - uidMagic)
}

function base36Encode(number: number): string {
  if (!Number.isInteger(number)) {
    throw new TypeError(`number must be an integer: ${number}`)
  }
  if (number < 0) {
    throw new RangeError(`number must be positive: ${number}`)
  }

  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
  let base36 = ''

  while (number > 0) {
    const remainder = number % 36
    base36 = alphabet[remainder] + base36
    number = Math.floor(number / 36)
  }

  return base36 || '0'
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
