import { useRef } from 'react'
import { ArrowDown } from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'
import { useInView } from 'react-intersection-observer'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useViewerDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const MessageFeed = () => {
  const { thread, messages, page, removeMessage } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const containerRef = useRef<HTMLDivElement>(null)
  const [latestMessageRef, latestMessageInView] = useInView()
  const shouldShowScrollToBottom = messages.length > 0 && !latestMessageInView

  const loadMore = () => {
    if (page.status === 'CanLoadMore') {
      console.log('load')
      page.loadMore(25)
    }
  }

  const scrollToEnd = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden" key={thread?._id}>
      <div
        ref={containerRef}
        className="flex flex-1 flex-col-reverse overflow-y-auto scroll-smooth"
      >
        {messages.map((message, index) => (
          <div key={message._id} ref={index === 0 ? latestMessageRef : null}>
            <Message
              timeline={index !== messages.length - 1}
              message={message}
              slug={thread?.slug}
              showMenu={isOwner}
              removeMessage={() => void removeMessage({ messageId: message._id })}
            />
          </div>
        ))}

        <InfiniteScroll
          hasMore={page.status === 'CanLoadMore'}
          isLoading={page.isLoading}
          next={loadMore}
        >
          <div className={cn('mx-auto mt-1', page.status === 'Exhausted' && 'hidden')}>
            <LoadingSpinner variant="infinity" className="bg-accentA-11" />
          </div>
        </InfiniteScroll>
      </div>

      {shouldShowScrollToBottom && (
        <IconButton
          variant="soft"
          className="absolute bottom-3 right-7 animate-fade animate-delay-100 animate-duration-100"
          onClick={scrollToEnd}
        >
          <ArrowDown />
        </IconButton>
      )}
    </div>
  )
}
