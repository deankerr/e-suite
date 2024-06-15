import { useCallback, useEffect, useRef, useState } from 'react'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useMessages } from '@/lib/queries'

import type { EMessage } from '@/convex/shared/types'

export const ChatFeed = () => {
  const { thread, removeMessage } = useChat()
  const messages = useMessages(thread?._id)

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollPanelTo = useCallback(
    (position: 'start' | 'end', options?: ScrollIntoViewOptions) => {
      const scroll = scrollRef.current
      if (!scroll) return

      const top = position === 'start' ? 0 : scroll.scrollHeight
      scroll.scrollTo({
        top,
        behavior: 'smooth',
        ...options,
      })
    },
    [],
  )

  // scroll to latest message if content/files are updated
  const trackLatestMessage = true
  const [latestMessage, setLatestMessage] = useState<EMessage | null>(null)
  const latest = messages?.at(-1)

  useEffect(() => {
    if (!trackLatestMessage || !latest) {
      setLatestMessage(null)
      return
    }

    const isNewMessage = latest._id !== latestMessage?._id

    if (isNewMessage) {
      scrollPanelTo('end', { behavior: latestMessage === null ? 'instant' : 'smooth' })
      setLatestMessage(latest)
      return
    } else {
      const contentHasChanged = latest.content !== latestMessage?.content
      const filesHaveChanged = latest.files && latest.files.length !== latestMessage?.files?.length
      if (contentHasChanged || filesHaveChanged) {
        scrollPanelTo('end')
        setLatestMessage(latest)
      }
    }
  }, [trackLatestMessage, latestMessage, latest, scrollPanelTo])

  if (messages === null) return <div>Error</div>
  if (!messages) return <LoadingSpinner />

  return (
    <div
      ref={scrollRef}
      className="flex w-full grow flex-col gap-2 overflow-y-auto overflow-x-hidden px-5 py-1"
    >
      {/* {chatCompletion && user && (
        <Message
          className="rounded bg-gold-4 px-2"
          message={getMessageShape({
            _id: '_instructions' as Id<'messages'>,
            _creationTime: 0,
            series: 0,
            threadId: thread?._id as Id<'threads'>,
            role: 'system',
            name: 'Instructions',
            content: thread?.instructions,
            userId: user.data?._id as Id<'users'>,
          })}
        />
      )} */}

      {messages.map((message) => (
        <Message
          key={message._id}
          message={message}
          slug={thread?.slug}
          removeMessage={removeMessage}
        />
      ))}
    </div>
  )
}
