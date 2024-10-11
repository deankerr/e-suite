import { useMemo, useRef } from 'react'
import { usePaginatedQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { useCachedQuery } from './helpers'
import { useThread } from './threads'

import type { Id } from '@/convex/_generated/dataModel'

export const useMessageQuery = (messageId: string) => {
  return useCachedQuery(api.db.messages.get, { messageId })
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

export const useMessageFeedQuery = (threadId: string, initialNumItems = 25) => {
  const messages = usePaginatedQuery(
    api.db.thread.messages.search,
    { threadId },
    {
      initialNumItems,
    },
  )
  const results = useMemo(() => messages.results.toReversed(), [messages.results])

  const firstLoadedMessageTime = useRef(0)
  if (!firstLoadedMessageTime.current && results[0]) {
    firstLoadedMessageTime.current = results[0]._creationTime
  }
  const prependedCount = results.filter(
    (message) => message._creationTime < firstLoadedMessageTime.current,
  ).length

  if (!threadId || threadId === 'new') {
    if (messages.status === 'LoadingFirstPage') {
      messages.status = 'Exhausted' as any
    }
  }

  return { ...messages, results, prependedCount }
}
