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
        'flex h-[calc(100svh-2.75rem)] max-h-full overflow-x-auto overflow-y-hidden',
        className,
      )}
    >
      {threadDeckIds.map((id) => (
        <ChatPanel
          key={id}
          className="mx-auto max-w-4xl flex-[1_0_min(100vw,24rem)] border-l last:border-r"
          threadId={id}
          handleCloseThread={() => setThreadDeckIds((ids) => ids.filter((id) => id !== id))}
        />
      ))}
    </div>
  )
}
