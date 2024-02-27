'use client'

import { ChatList } from '@/components/threads/ChatList'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function ChatPage() {
  const threads = useQuery(api.threads.threads.list)

  return <ChatList threads={threads} />
}
