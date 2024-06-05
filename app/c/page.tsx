'use client'

import { ChatView } from '@/components/chat/ChatView'
import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { useListThreads } from '@/lib/api'

const showMenu = false
export default function Page() {
  const threads = useListThreads()
  if (showMenu) return <CommandMenu asDialog={false} />
  if (!threads) return <div>loading</div>
  return (
    <div className="flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden p-3">
      {threads.map((thread) => (
        <ChatView
          key={thread.slug}
          thread={thread}
          className="flex-[1_0_min(100vw,28rem)] snap-center"
        />
      ))}
    </div>
  )
}
