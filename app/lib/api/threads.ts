import { useEffect, useRef } from 'react'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { useDebounceValue } from 'usehooks-ts'

import { useCachedQuery } from '@/app/lib/api/helpers'
import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export const useThreads = () => {
  const threads = useCachedQuery(api.db.threads.list, {})
  threads?.sort((a, b) => {
    if (a.favourite === true && b.favourite !== true) {
      return -1 // Favourites come first
    }
    if (b.favourite === true && a.favourite !== true) {
      return 1 // Favourites come first
    }
    return b.updatedAtTime - a.updatedAtTime // Then sort by updatedAtTime
  })
  return threads?.map((t, i) => ({ ...t, nn: i }))
}

export const useThread = (threadId: string) => {
  const threads = useThreads()
  const userThread = threads
    ? (threads?.find((thread) => thread.slug === threadId) ?? null)
    : undefined
  const otherThread = useCachedQuery(
    api.db.threads.get,
    !userThread ? { slugOrId: threadId } : 'skip',
  )

  return userThread || otherThread
}

export const useMessage = (slug?: string, msg?: string) => {
  const thread = useThread(slug ?? '')
  const message = useCachedQuery(
    api.db.thread.messages.get,
    slug && msg ? { threadId: slug, series: parseInt(msg) || -1 } : 'skip',
  )

  return {
    thread,
    message,
  }
}

export const useMessageById = (messageId: string) => {
  return useCachedQuery(api.db.messages.getDoc, { messageId: messageId as Id<'messages'> })
}

export const useMessageFeedQuery = (threadId: string) => {
  const messages = usePaginatedQuery(
    api.db.thread.messages.search,
    { threadId },
    {
      initialNumItems: appConfig.nInitialMessages,
    },
  )
  messages.results.reverse()

  return messages
}

export const useThreadTextSearch = (
  args: { threadId: string; name?: string },
  searchTextValue: string,
) => {
  const [debouncedValue, setDebouncedValue] = useDebounceValue(searchTextValue, 300, {
    maxWait: 1000,
  })
  useEffect(() => {
    setDebouncedValue(searchTextValue)
  }, [searchTextValue, setDebouncedValue])

  const results = useQuery(api.db.thread.messages.searchText, { ...args, text: debouncedValue })
  const stored = useRef(results)

  if (results !== undefined) {
    stored.current = results
  }

  return { results: stored.current, isLoading: results === undefined }
}
