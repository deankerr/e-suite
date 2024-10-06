import { useEffect, useRef } from 'react'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { parseAsString, useQueryState } from 'nuqs'
import { useDebounceValue } from 'usehooks-ts'

import { useCachedQuery } from '@/app/lib/api/helpers'
import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'

export const useThreads = () => {
  const threads = useCachedQuery(api.db.threads.list, {})
  if (!threads) return threads

  const favourites = threads
    .filter((thread) => thread.favourite)
    .sort((a, b) => b.updatedAtTime - a.updatedAtTime)
  const rest = threads
    .filter((thread) => !thread.favourite)
    .sort((a, b) => b.updatedAtTime - a.updatedAtTime)

  return [...favourites, ...rest]
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

  return { ...messages, results: messages.results.toReversed() }
}

export const useThreadTextSearchQueryParams = () => {
  const search = useQueryState('search', parseAsString.withDefault(''))
  const name = useQueryState('name', parseAsString.withDefault(''))
  return { search, name }
}

export const useThreadTextSearch = (
  args: { threadId: string; name?: string },
  textSearchValue: string,
) => {
  const [debouncedValue, setDebouncedValue] = useDebounceValue(textSearchValue, 300, {
    maxWait: 1000,
  })
  useEffect(() => {
    setDebouncedValue(textSearchValue)
  }, [textSearchValue, setDebouncedValue])

  const text = debouncedValue.length >= 3 ? debouncedValue : ''
  const isSkipped = !text

  const results = useQuery(api.db.thread.messages.searchText, text ? { ...args, text } : 'skip')
  const stored = useRef(results)

  if (results !== undefined) {
    stored.current = results
  }

  const isLoading = results === undefined && !isSkipped

  return {
    results: stored.current ?? [],
    isLoading,
    isSkipped,
  }
}

export const useThreadTextSearchResults = (threadId: string) => {
  const {
    search: [searchValue],
    name: [nameValue],
  } = useThreadTextSearchQueryParams()
  const results = useThreadTextSearch({ threadId, name: nameValue }, searchValue)
  return results
}
