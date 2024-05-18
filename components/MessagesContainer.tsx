import { useRef } from 'react'
import { ScrollArea } from '@radix-ui/themes'
import { useVirtualizer } from '@tanstack/react-virtual'

import { MessageCard } from '@/components/cards/MessageCard'
import { cn } from '@/lib/utils'

import type { MessageWithContent } from '@/convex/threads/query'

type MessagesContainerProps = { messages: MessageWithContent[] } & React.ComponentProps<
  typeof ScrollArea
>

export const MessagesContainer = ({ messages, className, ...props }: MessagesContainerProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  // The virtualizer
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1000,
    gap: 16,
    overscan: 16,
  })

  return (
    <ScrollArea {...props} className={cn('', className)} ref={parentRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={rowVirtualizer.measureElement}
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
  )
}
