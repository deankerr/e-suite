'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { useAtomValue } from 'jotai'

import { messageQueryAtom } from '@/components/providers/atoms'
import { api } from '@/convex/_generated/api'
import { useSuitePath } from '@/lib/helpers'

import type { EMessage } from '@/convex/types'
import type { UsePaginatedQueryReturnType } from 'convex/react'

export type MessageQueryFilters = {
  byMediaType?: 'images' | 'audio'
  role?: 'assistant' | 'user'
}

type MessagesQueryContextType = Omit<
  UsePaginatedQueryReturnType<typeof api.db.threads.listMessages>,
  'results'
> & {
  messages: EMessage[]
  isActive: boolean
}

const MessagesQueryContext = createContext<MessagesQueryContextType | undefined>(undefined)

export const MessagesQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug: threadSlug } = useSuitePath()
  const [currentThread, setCurrentThread] = useState(threadSlug)
  const isActive = threadSlug === currentThread

  useEffect(() => {
    if (!threadSlug) return
    setCurrentThread(threadSlug)
  }, [threadSlug])

  const queryFilters = useAtomValue(messageQueryAtom)

  const queryKey = currentThread ? { slugOrId: currentThread, ...queryFilters } : 'skip'
  const { results, loadMore, status, isLoading } = usePaginatedQuery(
    api.db.threads.listMessages,
    queryKey,
    {
      initialNumItems: 32,
    },
  )

  const checkLoadMore = (_: number) => {
    if (!isActive) {
      setCurrentThread(threadSlug)
    } else {
      loadMore(32)
    }
  }

  const value = isActive
    ? {
        isActive,
        messages: results,
        loadMore: checkLoadMore,
        status,
        isLoading,
      }
    : {
        isActive: false,
        messages: [],
        loadMore: checkLoadMore,
        status: 'CanLoadMore' as const,
        isLoading: false,
      }

  return <MessagesQueryContext.Provider value={value}>{children}</MessagesQueryContext.Provider>
}

export const useMessagesQuery = (): MessagesQueryContextType => {
  const context = useContext(MessagesQueryContext)
  if (!context) {
    throw new Error('useMessagesQuery must be used within a MessagesQueryProvider')
  }
  return context
}
