import { createContext, useContext, useState } from 'react'

import { useMessageBySeries, useThreads } from '@/lib/api'

const useCreateThreadContext = ({ slug, mNum }: { slug?: string; mNum?: number }) => {
  const { thread } = useThreads(slug)
  const threadTitle = thread ? (thread.title ?? 'untitled thread') : ''
  const seriesMessage = useMessageBySeries({ slug, series: mNum })
  return {
    thread,
    threadTitle,
    seriesMessage,
  }
}

type ThreadContext = ReturnType<typeof useCreateThreadContext>
const ThreadContext = createContext<ThreadContext | undefined>(undefined)

export const ThreadProvider = ({
  slug,
  mNum,
  children,
}: {
  slug?: string
  mNum?: number
  children: React.ReactNode
}) => {
  const api = useCreateThreadContext({ slug, mNum })
  return <ThreadContext.Provider value={api}>{children}</ThreadContext.Provider>
}

export const useThreadContext = (): ThreadContext => {
  const context = useContext(ThreadContext)
  if (!context) {
    throw new Error('useThreads must be used within a ThreadProvider')
  }
  return context
}
