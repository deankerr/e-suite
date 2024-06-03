'use client'

import { MessageCard, MessageCardSkeleton } from '@/components/cards/message-card/MessageCard'
import { ChatPanel } from '@/components/chat-panel/ChatPanel'
import { useThreadIndexContent } from '@/lib/api'

type SingleThreadPageProps = { threadIndex: [string, string, string] }

export const SingleThreadPage = ({ threadIndex }: SingleThreadPageProps) => {
  const threadFromIndex = useThreadIndexContent(threadIndex)

  if (threadIndex[2])
    return (
      <div className="w-full p-4">
        <MessageCardSkeleton className="mx-auto max-w-4xl" />
      </div>
    )

  if (threadIndex[1]) {
    const singleMessage = threadFromIndex?.messages[0]

    return singleMessage ? (
      <div className="w-full p-4">
        <MessageCard message={singleMessage} className="mx-auto max-w-4xl" />
      </div>
    ) : (
      <div className="w-full p-4">
        <MessageCardSkeleton className="mx-auto max-w-4xl" />
      </div>
    )
  }

  return <ChatPanel threadId={threadIndex[0]} className="w-full" />
}
