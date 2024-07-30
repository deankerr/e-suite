import { createContext, useContext } from 'react'

import { useLatestMessages, useThreads } from '@/lib/api'

const useCreateThreadContext = ({
  threadSlug,
  messageSeriesNum,
}: {
  threadSlug?: string
  messageSeriesNum?: string
}) => {
  const { thread } = useThreads(threadSlug)
  const messages = useLatestMessages(threadSlug)

  const threadTitle = thread ? (thread.title ?? 'untitled thread') : ''

  return { thread, messages, threadTitle }
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
