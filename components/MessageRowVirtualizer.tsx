import { useEffect, useRef } from 'react'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

import { MessageCard } from '@/components/cards/MessageCard'
import { cn } from '@/lib/utils'

import type { MessageWithContent } from '@/convex/threads/query'

type MessageRowVirtualizerProps = { messages: MessageWithContent[] } & React.ComponentProps<'div'>

type ScrollToOpts = {
  index: number
  options: {
    align?: 'start' | 'center' | 'end' | 'auto'
    behavior?: 'auto' | 'smooth'
  }
}

export const MessageRowVirtualizer = ({
  messages,
  className,
  ...props
}: MessageRowVirtualizerProps) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollToRef = useRef<ScrollToOpts>({ index: 0, options: { align: 'start' } })

  const virtualizer = useWindowVirtualizer({
    count: messages.length,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
    estimateSize: () => 900,
    overscan: 16,
  })

  const items = virtualizer.getVirtualItems()

  // useEffect(() => {
  //   // Scroll to the bottom of the page
  //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' })
  // }, [messages.length])

  const lastId = messages.at(-1)?._id
  useEffect(() => {
    const lastIndex = messages.length - 1
    if (lastIndex && lastId) {
      virtualizer.scrollToIndex(lastIndex, { align: 'end', behavior: 'smooth' })
    }
  }, [lastId, messages.length, virtualizer])

  return (
    <div {...props} className={cn('', className)} ref={parentRef}>
      <div className="fixed z-50 bg-sky-4 font-mono text-xs">
        {messages.length} {parentRef.current?.offsetTop}
      </div>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              <div className="py-2">
                <MessageCard message={messages[virtualRow.index]!} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
