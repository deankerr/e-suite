'use client'

import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { useSetAtom } from 'jotai'
import { useSelectedLayoutSegments } from 'next/navigation'

import { messageContentAtoms } from '@/app/gents/atoms'
import { api } from '@/convex/_generated/api'

export default function Layout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const [rid] = segments

  const messageQKey = rid ? { rid } : 'skip'
  const message = useQuery(api.messages.get, messageQKey)

  const setMessage = useSetAtom(messageContentAtoms(rid ?? ''))

  useEffect(() => {
    if (message) setMessage(message)
  }, [message, setMessage])

  return children
}
