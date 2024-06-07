'use client'

import { Chat } from '@/components/chat/Chat'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { getThreadShape } from '@/convex/shared/shape'
import { useUserThreadsList } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'

const threadSlugsOpen: string[] = []

export default function Page() {
  const threadsList = useUserThreadsList()

  const threads = threadsList.data?.filter((thread) => threadSlugsOpen.includes(thread.slug))

  return (
    <div className="flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-3 sm:py-3">
      <Chat
        thread={getThreadShape({
          _id: '' as Id<'threads'>,
          _creationTime: 0,
          slug: '',
          userId: '' as Id<'users'>,
          updatedAtTime: 1,
          metadata: [{ key: 'new_thread_tag', value: Date.now().toString() }],
        })}
        className={cn('flex-[1_0_min(100vw,36rem)] snap-center')}
      />

      {threads?.map((thread) => (
        <Chat
          key={thread.slug}
          thread={thread}
          className={cn('flex-[1_0_min(100vw,36rem)] snap-center')}
        />
      ))}
    </div>
  )
}
