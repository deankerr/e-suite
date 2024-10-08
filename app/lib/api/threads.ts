import { useEffect, useRef } from 'react'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { ms } from 'itty-time'
import { parseAsString, useQueryState } from 'nuqs'
import { useDebounceValue } from 'usehooks-ts'

import { useCachedQuery } from '@/app/lib/api/helpers'
import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { Id } from '@/convex/_generated/dataModel'
import type { EMessage } from '@/convex/types'

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

export const useListThreadRuns = (threadId: string) => {
  return useQuery(api.db.thread.runs.list, { threadId })
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

export const useStreamingMessages = (threadId: string) => {
  const runs = useListThreadRuns(threadId)
  const streamingMessages = runs
    ?.filter((run) => Date.now() - run._creationTime < ms('1 minute'))
    .map((run) => {
      const streams = run.texts.map((streamingText) => {
        // * streaming
        const message: EMessage = {
          _id: streamingText._id as unknown as Id<'messages'>,
          _creationTime: streamingText._creationTime,
          role: 'assistant' as const,
          text: streamingText.content,

          userId: streamingText.userId,
          threadId: run.threadId,
          threadSlug: 'streaming',
          runId: run._id,

          kvMetadata: {},
          series: 0,
          userIsViewer: false,
        }
        return message
      })
      if (streams.length === 0 && run.status !== 'failed') {
        // * non-streaming
        return {
          _id: run._id as unknown as Id<'messages'>,
          _creationTime: run._creationTime,
          role: 'assistant' as const,

          userId: run.userId,
          threadId: run.threadId,
          threadSlug: 'waiting',
          runId: run._id,

          kvMetadata: {},
          series: 0,
          userIsViewer: false,
        }
      }

      return streams
    })
    .flat()
    .toReversed()

  return streamingMessages
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

export const useUpdateThread = () => {
  return useMutation(api.db.threads.update)
}

export const useDeleteThread = () => {
  return useMutation(api.db.threads.remove)
}

export const useUpdateMessage = () => {
  return useMutation(api.db.messages.update)
}

export const useDeleteMessage = () => {
  return useMutation(api.db.messages.remove)
}
