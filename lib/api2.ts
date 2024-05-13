import { useEffect } from 'react'
import { usePaginatedQuery, usePreloadedQuery } from 'convex/react'
import { useAtom, useAtomValue } from 'jotai'

import { api } from '@/convex/_generated/api'
import { activeThreadAtom } from '@/lib/atoms'

import type { Preloaded } from 'convex/react'

export const useLatestThread = (preloadedThread: Preloaded<typeof api.ext.threads.getLatest>) => {
  const latest = usePreloadedQuery(preloadedThread)
  const [thread, set] = useAtom(activeThreadAtom)

  useEffect(() => {
    if (thread) return
    set(latest?.thread ?? null)
  }, [latest?.thread, set, thread])

  return latest
}

export const useThread = () => {
  const thread = useAtomValue(activeThreadAtom)
  return thread
}

export const useThreads = () => {
  const threads = usePaginatedQuery(api.ext.threads.list, {}, { initialNumItems: 20 })
  return threads
}
