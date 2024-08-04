import { useEffect, useRef } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import { useInView } from 'react-intersection-observer'

import { Message } from '@/components/message/Message'
import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { useThreadContext } from '@/components/providers/ThreadProvider'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const MessageFeed = () => {
  const { thread } = useThreadContext()

  const { messages, isLoading, isActive } = useMessagesQuery()

  const containerRef = useRef<HTMLDivElement>(null)
  const [endOfFeedRef, endOfFeedInView] = useInView()
  const shouldShowScrollToBottom = messages && messages.length > 0 && !endOfFeedInView

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
    if (!initialScrollToEnd.current && messages && messages.length > 0) {
      scrollToEnd('instant')
      initialScrollToEnd.current = true
    }
  }, [messages])

  if (!thread) return null
  if (isLoading && (messages === undefined || messages?.length === 0)) return <MessagesLoading />

  return (
    <div className="grow overflow-hidden">
      <ScrollArea ref={containerRef} scrollbars="vertical">
        <div className="flex-center min-h-4 py-2">
          <LoadMoreButton />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col-reverse items-center overflow-hidden px-3 text-sm">
          <div ref={endOfFeedRef} className="pointer-events-none h-4 w-full" />

          {messages.map((message, i) => (
            <Message
              key={message._id}
              message={message}
              priority={i === 0}
              deepLinkUrl={`${appConfig.chatUrl}/${thread.slug}/${message.series}`}
              isSequential={isSameAuthor(message, messages.at(i + 1))}
            />
          ))}
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

const isSameAuthor = (...messages: (EMessage | undefined)[]) => {
  const firstMessage = messages.at(0)
  if (!firstMessage) return false
  return messages.every(
    (message) => message?.name === firstMessage.name && message?.role === firstMessage.role,
  )
}

const isShortMessage = (message: EMessage | undefined) => {
  if (!message) return false
  const hasShortText = !!message.text && message.text.length < 300
  const hasMedia = message.images.length > 0 || message.audio.length > 0
  return hasShortText && !hasMedia
}

const isUserRoleMessage = (message: EMessage | undefined) => {
  if (!message) return false
  return message.role === 'user'
}

const LoadMoreButton = () => {
  const { status, isLoading, loadMore } = useMessagesQuery()

  if (status === 'Exhausted') return null
  return (
    <Button
      variant="surface"
      size="1"
      color="gray"
      className="w-48"
      disabled={status !== 'CanLoadMore'}
      onClick={() => loadMore(32)}
    >
      {isLoading ? <LoadingSpinner className="w-4" /> : 'Load More Messages'}
    </Button>
  )
}

const MessagesLoading = () => {
  return (
    <div className="mx-auto grid w-full max-w-3xl grow auto-rows-fr gap-4 overflow-hidden px-3 py-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <Skeleton key={i} style={{ animationDelay: `-${i * 100}ms` }} />
      ))}
    </div>
  )
}
