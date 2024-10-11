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

  return { ...messages, results: messages.results.toReversed() }
}
