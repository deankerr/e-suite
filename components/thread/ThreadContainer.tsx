import { useRef } from 'react'
import { ScrollArea } from '@radix-ui/themes'
import { useVirtualizer } from '@tanstack/react-virtual'

import { MessageCard } from '@/components/cards/MessageCard'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { EMessageContent, EThread } from '@/convex/validators'
import type { UsePaginatedQueryReturnType } from 'convex/react'

type ThreadContainerProps = {
  thread: EThread
  page: UsePaginatedQueryReturnType<typeof api.threads.query.listMessages>
  series?: EMessageContent[] | null
} & React.ComponentProps<'div'>

export const ThreadContainer = ({
  thread,
  page,
  series,
  className,
  ...props
}: ThreadContainerProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const messages = series ?? page.results.toReversed()

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1000,
    gap: 16,
    overscan: 16,
  })

  return (
    <div {...props} className={cn('grid h-full rounded border border-gray-3 p-2', className)}>
      <ScrollArea ref={parentRef} className="overscroll-none">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
          className="mx-auto w-full max-w-4xl"
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
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MessageCard slug={thread.slug} message={messages[virtualItem.index]!} />
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
