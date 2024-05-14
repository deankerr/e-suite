'use client'

import { MessageCard, MessageCardSkeleton } from '@/components/cards/MessageCard'
import { InputBarB } from '@/components/input-bar/InputBarB'
import { useActiveThread } from '@/lib/api3'

export const DashboardPage = () => {
  const thread = useActiveThread()
  const messages = thread?.messages ?? []
  return (
    <>
      {!thread && <DashboardPageSkeleton />}
      <div className="px-1 py-4 md:px-4">
        <div className="mx-auto space-y-4">
          {messages.map((message) => (
            <MessageCard key={message._id} message={message} />
          ))}
        </div>
      </div>

      <InputBarB centered={thread !== undefined && messages.length === 0} />
    </>
  )
}

const DashboardPageSkeleton = () => {
  return (
    <>
      <div className="absolute inset-0 grid w-full animate-pulse grid-rows-4 gap-4 p-1 md:p-4">
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-1"></div>
    </>
  )
}
