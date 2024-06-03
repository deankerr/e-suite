import { useCallback, useEffect, useState } from 'react'

import { MessageCard } from '@/components/cards/message-card/MessageCard'
import { useViewerDetails } from '@/lib/api'
import { cn, getMessageShape } from '@/lib/utils'

import type { Id } from '@/convex/_generated/dataModel'
import type { EMessageWithContent, EThreadWithContent } from '@/convex/shared/structures'

type ChatMessagesProps = { thread: EThreadWithContent } & React.ComponentProps<'div'>

export const ChatMessages = ({ thread, className, ...props }: ChatMessagesProps) => {
  const { user } = useViewerDetails()
  const chatCompletion = thread.config.type === 'chat-completion' ? thread.config : null

  const scrollPanelTo = useCallback(
    (position: 'start' | 'end', options?: ScrollIntoViewOptions) => {
      const panel = document.getElementById(`${thread._id}-chat-panel`)
      if (!panel) return

      const top = position === 'start' ? 0 : panel.scrollHeight
      panel.scrollTo({
        top,
        behavior: 'smooth',
        ...options,
      })
    },
    [thread._id],
  )

  // scroll to latest message if content/files are updated
  const trackLatestMessage = true
  const [latestMessage, setLatestMessage] = useState<EMessageWithContent | null>(null)
  const latest = thread.messages.at(-1)

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

  return (
    <div {...props} className={cn('flex h-full w-full flex-col gap-4 p-3', className)}>
      {chatCompletion && user && (
        <MessageCard
          message={getMessageShape({
            _id: '_instructions' as Id<'messages'>,
            threadId: thread._id,
            role: 'system',
            name: 'Instructions',
            content: thread.instructions,
            owner: user,
          })}
        />
      )}

      {thread.messages.map((message) => (
        <MessageCard key={message._id} message={message} id={`${message._id}`} />
      ))}
    </div>
  )
}
