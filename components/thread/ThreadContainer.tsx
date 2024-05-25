import { useCallback, useRef, useState } from 'react'
import { ScrollArea } from '@radix-ui/themes'
import { useVirtualizer } from '@tanstack/react-virtual'

import { MessageCard } from '@/components/cards/MessageCard'
import { cn } from '@/lib/utils'

import type { api } from '@/convex/_generated/api'
import type { EMessageContent, EThread } from '@/convex/shared/schemas'
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [initialScrollToBottom, setInitialScrollToBottom] = useState(false)

  const messages = series ?? page.results.toReversed()
  const isStreaming = messages.some((message) =>
    message.jobs.some((job) => job.name === 'chat-completion-stream' && job.status === 'active'),
  )

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: () => 1600,
    getItemKey: useCallback((index: number) => messages[index]?._id ?? index, [messages]),
    gap: 16,
    overscan: 5,
    paddingStart: 4,
    paddingEnd: 180,
    onChange: () => {
      if (isStreaming && scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop =
          scrollAreaRef.current.scrollHeight + scrollAreaRef.current.offsetHeight
        return
      }

      if (!initialScrollToBottom && scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop =
          scrollAreaRef.current.scrollHeight + scrollAreaRef.current.offsetHeight
        setInitialScrollToBottom(true)
      }
    },
  })

  return (
    <div {...props} className={cn('grid h-full', className)}>
      <ScrollArea ref={scrollAreaRef} className="overscroll-none">
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
                insetInline: 0,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MessageCard slug={thread.slug} message={messages[virtualItem.index]!} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
