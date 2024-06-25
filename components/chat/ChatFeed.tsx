import { useEffect, useRef, useState } from 'react'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ScrollContainer } from '@/components/ui/ScrollContainer'
import { useVoiceoverPlayer } from '@/components/voiceovers/useVoiceoverPlayer'
import { useViewerDetails } from '@/lib/queries'

export const ChatFeed = () => {
  const { thread, messages, removeMessage } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)
  useVoiceoverPlayer(thread?._id)

  const latestMessageRef = useRef<HTMLDivElement>(null)
  const [initialScroll, setInitialScroll] = useState(false)

  useEffect(() => {
    if (initialScroll || latestMessageRef.current === null) return
    setInitialScroll(true)
    latestMessageRef.current.scrollIntoView({ behavior: 'instant' })
  }, [initialScroll, messages])

  if (messages === null) return <div>Error</div>
  return (
    <ScrollContainer className="flex flex-col px-2">
      {messages.isPending && <LoadingSpinner className="m-auto" />}
      {messages.data?.map((message, i) => (
        <div key={message._id} ref={latestMessageRef}>
          <Message
            timeline={i !== messages.data.length - 1}
            message={message}
            slug={thread?.slug}
            showMenu={isOwner}
            removeMessage={removeMessage}
          />
        </div>
      ))}
    </ScrollContainer>
  )
}

/* {chatCompletion && user && ( <Message className="rounded bg-gold-4 px-2"
        message={getMessageShape({ _id: '_instructions' as Id<'messages'>, _creationTime: 0, series:
        0, threadId: thread?._id as Id<'threads'>, role: 'system', name: 'Instructions', content:
        thread?.instructions, userId: user.data?._id as Id<'users'>,
          })}
        />
      )} */
