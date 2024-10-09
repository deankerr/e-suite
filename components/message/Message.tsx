'use client'

import { useMessageQuery } from '@/app/lib/api/messages'
import { Loader } from '../ui/Loader'
import { MessageBody } from './MessageBody'
import { MessageHeader } from './MessageHeader'
import { MessageProvider } from './MessageProvider'

export const Message = ({ messageId }: { messageId: string }) => {
  const message = useMessageQuery(messageId)

  if (!message) {
    return <div className="flex-center shrink-0 rounded-md border p-1.5">Loading...</div>
  }

  return (
    <MessageProvider initialMessage={message}>
      <div className="flex shrink-0 flex-col rounded border bg-gray-2">
        <MessageHeader />
        <MessageBody />
      </div>
    </MessageProvider>
  )
}
