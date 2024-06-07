import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatMessage } from '@/components/chat/ChatMessage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createMessageShape } from '@/convex/shared/utils'
import { useViewerDetails } from '@/lib/api'
import { useMessagesList } from '@/lib/api2'
import { cn } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'
import type { E_Message, E_Thread } from '@/convex/shared/types'

type ChatMessagesProps = { thread: E_Thread } & React.ComponentProps<'div'>

export const ChatMessages = ({ thread, className, ...props }: ChatMessagesProps) => {
  const messages = useMessagesList(thread._id)
  const scrollRef = useRef<HTMLDivElement>(null)
  //^ start copied from prev
  const { user } = useViewerDetails()
  const chatCompletion =
    thread.currentInferenceConfig.type === 'chat-completion' ? thread.config : null

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
  const [latestMessage, setLatestMessage] = useState<E_Message | null>(null)
  const latest = messages.data?.at(-1)

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
  //^ end copied from prev

  if (messages.isError) return <div>Error {messages.error.message}</div>
  if (messages.isPending) return <LoadingSpinner />

  return (
    <div
      {...props}
      ref={scrollRef}
      className={cn(
        'flex h-full flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 py-3',
        className,
      )}
    >
      {chatCompletion && user && (
        <ChatMessage
          className="rounded bg-gold-4 px-2"
          message={createMessageShape({
            _id: '_instructions' as Id<'messages'>,
            _creationTime: 0,
            series: 0,
            threadId: thread._id as Id<'threads'>,
            role: 'system',
            name: 'Instructions',
            content: thread.instructions,
            userId: user._id as Id<'users'>,
          })}
        />
      )}

      {messages.data.map((message) => (
        <ChatMessage key={message._id} message={message} />
      ))}
    </div>
  )
}
