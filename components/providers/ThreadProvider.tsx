import { createContext, useContext, useState } from 'react'

import { useMessageBySeries, useThreads } from '@/lib/api'

type MessagesQuery = {
  byMediaType?: 'images' | 'audio'
}

const useCreateThreadContext = ({
  threadSlug,
  messageSeriesNum,
}: {
  threadSlug?: string
  messageSeriesNum?: string
}) => {
  const { thread } = useThreads(threadSlug)
  const [messagesQuery, setMessagesQuery] = useState<MessagesQuery>({})

  const isSeriesMessage = !!messageSeriesNum

  const seriesMessage = useMessageBySeries({ slug: threadSlug, series: messageSeriesNum })

  const threadTitle = thread ? (thread.title ?? 'untitled thread') : ''

  return {
    thread,
    messagesQuery,
    setMessagesQuery,
    threadTitle,
    seriesMessage,
    isSeriesMessage,
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
