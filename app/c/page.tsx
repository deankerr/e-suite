'use client'

import { Chat } from '@/components/chat/Chat'
import { CommandMenu } from '@/components/command-menu/CommandMenu'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useUserThreadsList } from '@/lib/api2'

const showMenu = false
export default function Page() {
  const threads = useUserThreadsList()
  if (showMenu) return <CommandMenu asDialog={false} />
  if (!threads) return <LoadingSpinner />
  return (
    <div className="flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-3">
      {threads.data?.map((thread) => (
        <Chat
          key={thread.slug}
          thread={thread}
          className="flex-[1_0_min(100vw,36rem)] snap-center"
        />
      ))}
    </div>
  )
}
