import { createContext, useContext, useState } from 'react'

import { useLatestMessages, useSeriesMessage, useThreads } from '@/lib/api'

export type ChatQueryFilters = {
  role?: 'user' | 'assistant'
  hasContent?: 'image' | 'audio'
}

const useCreateThreadContext = ({
  threadSlug,
  messageSeriesNum,
}: {
  threadSlug?: string
  messageSeriesNum?: string
}) => {
  const { thread } = useThreads(threadSlug)
  const [queryByMediaType, setQueryByMediaType] = useState<'images' | 'audio' | undefined>(
    undefined,
  )
  const isSeriesMessage = !!messageSeriesNum

  const latestMessages = useLatestMessages({ slugOrId: threadSlug, byMediaType: queryByMediaType })
  const messages = latestMessages

  const seriesMessage = useSeriesMessage({ slug: threadSlug, series: messageSeriesNum })

  const threadTitle = thread ? (thread.title ?? 'untitled thread') : ''

  return {
    thread,
    messages,
    threadTitle,
    seriesMessage,
    isSeriesMessage,
    queryByMediaType,
    setQueryByMediaType,
  }
}

type ThreadContext = ReturnType<typeof useCreateThreadContext>
const ThreadContext = createContext<ThreadContext | undefined>(undefined)

export const ThreadProvider = ({
  threadSlug,
  messageSeriesNum,
  children,
}: {
  threadSlug?: string
  messageSeriesNum?: string
  children: React.ReactNode
}) => {
  const api = useCreateThreadContext({ threadSlug, messageSeriesNum })
  return <ThreadContext.Provider value={api}>{children}</ThreadContext.Provider>
}

export const useThreadContext = (): ThreadContext => {
  const context = useContext(ThreadContext)
  if (!context) {
    throw new Error('useThreads must be used within a ThreadProvider')
  }
  return context
}
