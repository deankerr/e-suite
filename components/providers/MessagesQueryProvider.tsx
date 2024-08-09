'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { useQueryState } from 'nuqs'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'
import { useCacheQuery } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { EMessage } from '@/convex/types'
import type { UsePaginatedQueryReturnType } from 'convex/react'

const { nLatestMessages } = appConfig
export const MessagesQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug } = useSuitePath()
  const [viewFilter] = useQueryState('view')
  const [roleFilter] = useQueryState('role')
  const [isListQuery, setIsListQuery] = useState(false)

  useEffect(() => {
    setIsListQuery(false)
  }, [viewFilter, roleFilter, slug])

  const queryKey = slug
    ? {
        slugOrId: slug,
        limit: nLatestMessages,
        byMediaType: viewFilter === 'images' ? ('images' as const) : undefined,
        role: ['user', 'assistant'].includes(roleFilter || '')
          ? (roleFilter as 'user' | 'assistant')
          : undefined,
      }
    : 'skip'

  const latest = useCacheQuery(api.db.threads.latestMessages, queryKey)
  const { results, loadMore, status } = usePaginatedQuery(
    api.db.threads.listMessages,
    isListQuery ? queryKey : 'skip',
    {
      initialNumItems: nLatestMessages * 2,
    },
  )

  const messages = [...(latest ?? []), ...results.slice(latest?.length ?? 0)].reverse()

  const listLoadMore = useCallback(() => {
    if (isListQuery) {
      loadMore(nLatestMessages * 2)
    } else {
      setIsListQuery(true)
    }
  }, [isListQuery, loadMore, setIsListQuery])

  const value = {
    messages,
    loadMore: listLoadMore,
    status,
  }

  return <MessagesQueryContext.Provider value={value}>{children}</MessagesQueryContext.Provider>
}

type MessagesQueryContextType = {
  messages: EMessage[]
  loadMore: () => void
  status: UsePaginatedQueryReturnType<typeof api.db.threads.listMessages>['status']
}

const MessagesQueryContext = createContext<MessagesQueryContextType | undefined>(undefined)

export const useMessagesQuery = (): MessagesQueryContextType => {
  const context = useContext(MessagesQueryContext)
  if (!context) {
    throw new Error('useMessagesQuery must be used within a MessagesQueryProvider')
  }
  return context
}
