'use client'

import { useAtom } from 'jotai'

import { ChatPanel } from '@/components/chat-panel/ChatPanel'
import { threadDeckIdsAtom } from '@/lib/atoms'
import { cn } from '@/lib/utils'

type ThreadsPageProps = {
  props?: unknown
} & React.ComponentProps<'div'>

export const ThreadsPage = ({ className, ...props }: ThreadsPageProps) => {
  const [threadDeckIds, setThreadDeckIds] = useAtom(threadDeckIdsAtom)
  return (
    <div
      {...props}
      className={cn(
        'flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden p-3',
        className,
      )}
    >
      {threadDeckIds.map((slug) => (
        <ChatPanel
          key={slug}
          className="mx-auto max-w-3xl flex-[1_0_min(100vw,24rem)] snap-center rounded-md border"
          threadId={slug}
          onClosePanel={() => setThreadDeckIds((ids) => ids.filter((id) => id !== slug))}
        />
      ))}
    </div>
  )
}
