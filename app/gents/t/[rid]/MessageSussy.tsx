import { Suspense } from 'react'

import { useGetMessageSuspense } from '@/app/gents/api'

import type { Id } from '@/convex/_generated/dataModel'
import type { Message as MessageEnt } from '@/convex/external'

type MessageSussyProps = { message: MessageEnt }

export const MessageSussy = ({ message }: MessageSussyProps) => {
  return (
    <div className="border p-2">
      {message.role} {message.name} {message.text}
    </div>
  )
}

type MessageFromIdSussyProps = { messageId: Id<'messages'> }

export const MessageFromIdSussy = ({ messageId }: MessageFromIdSussyProps) => {
  const message = useGetMessageSuspense(messageId)

  const f = <div className="border bg-violet-6 p-2">suspense</div>

  return (
    <Suspense fallback={f}>
      <MessageSussy message={message} />
    </Suspense>
  )
}
