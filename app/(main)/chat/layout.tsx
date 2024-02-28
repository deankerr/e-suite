'use client'

import { ChatList } from '@/components/threads/ChatList'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const threads = useQuery(api.threads.threads.list)
  return (
    <div className="flex">
      <ChatList threads={threads} />
      {children}
    </div>
  )
}
