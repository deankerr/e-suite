import { useEffect, useRef } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import { useInView } from 'react-intersection-observer'

import { Message } from '@/components/message/Message'
import { useChat } from '@/components/providers/ChatProvider'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const MessageFeed = () => {
  const { thread, messages } = useChat()

  const containerRef = useRef<HTMLDivElement>(null)
  const [endOfFeedRef, endOfFeedInView] = useInView()
  const shouldShowScrollToBottom = messages.length > 0 && !endOfFeedInView

  const scrollToEnd = (behavior: 'smooth' | 'instant' = 'smooth') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      })
    }
  }

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (!initialScrollToEnd.current && messages.length > 0) {
      scrollToEnd('instant')
      initialScrollToEnd.current = true
    }
  }, [messages])

  if (!thread) return null

  return (
    <div className="overflow-hidden">
      <ScrollArea ref={containerRef} scrollbars="vertical">
        <div className="mx-auto flex flex-col-reverse items-center overflow-hidden px-3 text-sm">
          <div ref={endOfFeedRef} className="pointer-events-none h-4 w-full" />

          {/* * messages * */}
          {messages.map((message, i) => (
            <Message
              key={message._id}
              message={message}
              deeplink={`${appConfig.chatUrl}/${thread.slug}/${message.series}`}
              showNameAvatar={!isSameAuthor(message, messages.at(i + 1))}
            />
          ))}

          <LoadMoreButton />
        </div>
      </ScrollArea>

      {/* * scroll to bottom * */}
      <IconButton
        variant="soft"
        className={cn(
          'absolute bottom-6 right-12 animate-fade animate-delay-100 animate-duration-100',
          !shouldShowScrollToBottom && 'hidden',
        )}
        onClick={() => scrollToEnd('smooth')}
      >
        <Icons.ArrowDown className="phosphor" />
      </IconButton>
    </div>
  )
}

const isSameAuthor = (message: EMessage, previousMessage?: EMessage) => {
  if (previousMessage === undefined || message.role !== 'user') return false
  return message.name && message.name === previousMessage.name
}

const LoadMoreButton = () => {
  const { page, loadMoreMessages } = useChat()

  if (page.status === 'Exhausted') return <EndOfFeedIndicator position="end" />

  return (
    <div className="flex h-12 w-full items-center justify-center">
      <Button
        variant="surface"
        size="1"
        color="gray"
        className="w-48"
        disabled={page.status !== 'CanLoadMore'}
        onClick={() => loadMoreMessages()}
      >
        {page.isLoading ? (
          <Icons.CircleNotch className="size-4 animate-spin" />
        ) : (
          'Load More Messages'
        )}
      </Button>
    </div>
  )
}

const EndOfFeedIndicator = ({ position = 'start' }: { position?: 'start' | 'end' }) => {
  return (
    <div
      className={cn(
        'flex h-7 w-full shrink-0 items-center justify-center overflow-hidden',
        position === 'start' ? 'mb-2' : 'mt-2',
      )}
    >
      <div className="absolute right-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      <div className="absolute left-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      {position === 'start' ? (
        <Icons.SunHorizon className="size-6 rounded text-grayA-5" />
      ) : (
        <Icons.Planet className="size-6 rounded text-grayA-5" />
      )}
    </div>
  )
}
