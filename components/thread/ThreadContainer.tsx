import { useCallback, useRef, useState } from 'react'
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [initialScrollToBottom, setInitialScrollToBottom] = useState(false)
  // const [latestId, setLatestId] = useState<string>('')

  const messages = series ?? page.results.toReversed()

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: () => 1600,
    getItemKey: useCallback((index: number) => messages[index]?._id ?? index, [messages]),
    gap: 16,
    overscan: 5,
    paddingEnd: 140,
    onChange: (v) => {
      console.log('change')
      if (initialScrollToBottom) return
      setInitialScrollToBottom(true)
      if (messages.length > 0) v.scrollToIndex(messages.length - 1)
    },
  })

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     const id = messages[messages.length - 1]?._id
  //     if (id) setLatestId(id)
  //   }
  // }, [messages])

  // useEffect(() => {
  //   if (latestId) {
  //     const el = document.getElementById('vrow-bottom')
  //     if (el) el.scrollIntoView({ behavior: 'auto' })
  //   }
  // }, [latestId])

  return (
    <div {...props} className={cn('grid h-full p-2', className)}>
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
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MessageCard slug={thread.slug} message={messages[virtualItem.index]!} />
            </div>
          ))}
          <div id="vrow-bottom" />
        </div>
      </ScrollArea>

      <div className="absolute h-4 w-2 overflow-hidden font-mono text-xs text-gray-4 hover:w-auto hover:bg-overlay hover:text-gray-11">
        thread/{thread.slug} {thread.title}
      </div>
    </div>
  )
}
