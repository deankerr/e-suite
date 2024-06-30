import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import { useTimeoutEffect } from '@react-hookz/web'
import { useInView } from 'react-intersection-observer'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { useViewerDetails } from '@/lib/queries'

export const MessageFeed = () => {
  const { thread, messages, page, removeMessage } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const containerRef = useRef<HTMLDivElement>(null)

  // restore scroll position after loading older messages
  const firstElementId = useRef<string>()
  const firstElementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const firstMessageId = messages[0]?._id
    if (containerRef.current) {
      if (firstMessageId !== firstElementId.current) {
        firstElementRef.current?.scrollIntoView({ behavior: 'instant' })
      }
    }
    firstElementId.current = firstMessageId
  }, [messages])

  const [lastMessageRef, lastMessageInView] = useInView()

  // scroll to new messages if near the bottom
  const lastElementId = useRef<string>()
  useEffect(() => {
    const lastMessageId = messages[messages.length - 1]?._id
    if (containerRef.current) {
      if (lastMessageId !== lastElementId.current && lastMessageInView) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }

    lastElementId.current = lastMessageId
  }, [lastMessageInView, messages])

  const [loaderTimeout, setLoaderTimeout] = useState(true)
  const [_, reset] = useTimeoutEffect(() => {
    setLoaderTimeout(false)
  }, 1000)

  const loadMore = () => {
    if (page.status === 'CanLoadMore' && !loaderTimeout) {
      console.log('load')
      page.loadMore(25)
      reset()
    }
  }

  const scrollToEnd = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <InfiniteScroll
          hasMore={page.status === 'CanLoadMore'}
          isLoading={page.isLoading}
          next={loadMore}
        >
          <Button>{loaderTimeout ? 'timeout' : page.status}</Button>
        </InfiniteScroll>

        {messages.map((message, index) => (
          <div
            key={message._id}
            ref={
              firstElementId.current === message._id
                ? firstElementRef
                : index === messages.length - 1
                  ? lastMessageRef
                  : null
            }
          >
            <Message
              timeline={index !== messages.length - 1}
              idx={index}
              message={message}
              slug={thread?.slug}
              showMenu={isOwner}
              removeMessage={() => void removeMessage({ messageId: message._id })}
            />
          </div>
        ))}
      </div>

      {!lastMessageInView && (
        <IconButton variant="soft" className="absolute bottom-3 right-7" onClick={scrollToEnd}>
          <ArrowDown />
        </IconButton>
      )}
    </div>
  )
}
