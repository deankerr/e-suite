import { preloadQuery } from 'convex/nextjs'

import { api } from '@/convex/_generated/api'
import { getAuthToken } from '@/lib/auth'

import type { Preloaded } from 'convex/react'

export type PreloadedThreadsQuery = Preloaded<typeof api.threads.query.listThreads>

export const preloadThreads = async () => {
  const token = await getAuthToken()
  return await preloadQuery(api.threads.query.listThreads, {}, { token })
}
