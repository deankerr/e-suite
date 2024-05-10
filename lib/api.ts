import { useEffect, useMemo } from 'react'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { atom, useAtom } from 'jotai'

import { api } from '@/convex/_generated/api'
import { MessageContent, Thread } from '@/convex/external'

const threadRidAtom = atom('')
const threadAtom = atom<Thread | null | undefined>(undefined)
const messagesAtom = atom<MessageContent[]>([])
const pagerStatusAtom = atom<{
  isLoading: boolean
  status: 'LoadingFirstPage' | 'CanLoadMore' | 'LoadingMore' | 'Exhausted'
}>({ isLoading: false, status: 'Exhausted' })

export const useThreadRidAtom = () => useAtom(threadRidAtom)

export const useGlobalThreadManager = () => {
  const [rid] = useThreadRidAtom()
  const [_thread, setThread] = useAtom(threadAtom)
  const [_messages, setMessages] = useAtom(messagesAtom)
  const [_status, setStatus] = useAtom(pagerStatusAtom)

  const queryKey = rid ? { rid } : 'skip'
  const threadResult = useQuery(api.threads.get, queryKey)
  const {
    results: messageResults,
    isLoading,
    status,
    loadMore,
  } = usePaginatedQuery(api.threads.messages, queryKey, {
    initialNumItems: 5,
  })

  const thread = useMemo(() => threadResult, [threadResult])
  const messages = useMemo(() => messageResults, [messageResults])

  useEffect(() => {
    setThread(thread)
    console.log('thread ->', thread)
  }, [setThread, thread])

  useEffect(() => {
    setMessages(messages)
    console.log('messages ->', messages)
  }, [setMessages, messages])

  useEffect(() => {
    setStatus({ isLoading, status })
  }, [isLoading, setStatus, status])

  return { loadMore }
}

export const useGlobalThreadPage = () => {
  const [thread] = useAtom(threadAtom)
  const [messages] = useAtom(messagesAtom)
  const [status] = useAtom(pagerStatusAtom)

  return { thread, messages, isLoading: status.isLoading, status: status.status }
}
