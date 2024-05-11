'use client'

import { useEffect } from 'react'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { useSetAtom } from 'jotai'
import { useSelectedLayoutSegments } from 'next/navigation'

import { threadAtoms, useMessagesSetter } from '@/app/gents/atoms'
import { api } from '@/convex/_generated/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const [rid] = segments

  const threadQKey = rid ? { rid } : 'skip'
  const thread = useQuery(api.threads.get, threadQKey)
  const pager = usePaginatedQuery(api.threads.messages, threadQKey, {
    initialNumItems: 5,
  })
  const messageRids = pager.results.map((message) => message.message.rid)

  const setThread = useSetAtom(threadAtoms(rid ?? ''))
  const setMessages = useMessagesSetter()

  useEffect(() => {
    if (thread) {
      setThread({ thread, pager, messageRids })
      setMessages(pager.results)
    }
  }, [messageRids, pager, setMessages, setThread, thread])

  return children
}
