import { useRef } from 'react'
import { ScrollArea } from '@radix-ui/themes'
import { useVirtualizer } from '@tanstack/react-virtual'

import { MessageCard } from '@/components/cards/MessageCard'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { MessageWithContent, ThreadWithMessages } from '@/convex/threads/query'
import type { UsePaginatedQueryReturnType } from 'convex/react'

type ThreadContainerProps = {
  thread: ThreadWithMessages
  messages?: MessageWithContent[]
  page: UsePaginatedQueryReturnType<typeof api.threads.query.pageMessages>
} & React.ComponentProps<'div'>

export const ThreadContainer = ({ thread, page, className, ...props }: ThreadContainerProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const messages = page.results.toReversed()

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1000,
    gap: 16,
    overscan: 16,
  })

  return (
    <div {...props} className={cn('border-tomato grid h-full rounded border p-2', className)}>
      <ScrollArea ref={parentRef} className="overscroll-none">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                // height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MessageCard message={messages[virtualItem.index]!} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bg-overlay font-mono text-xs">
        thread[{thread.slug}] {thread.title}
      </div>
    </div>
  )
}
