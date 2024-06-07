'use client'

import { Chat } from '@/components/chat/Chat'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useUserThreadsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

export default function Page() {
  const threads = useUserThreadsList()

  if (!threads) return <LoadingSpinner />

  return (
    <div className="flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-3 sm:py-3">
      {threads.data?.map((thread) => (
        <Chat
          key={thread.slug}
          thread={thread}
          className={cn('flex-[1_0_min(100vw,36rem)] snap-center')}
        />
      ))}
    </div>
  )
}
