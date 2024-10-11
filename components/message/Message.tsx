'use client'

import { MessageBody } from './MessageBody'
import { MessageHeader } from './MessageHeader'
import { MessageProvider } from './MessageProvider'

import type { MessageFeedContext } from '../chat/panels/MessageFeed2'
import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  context,
}: {
  message: EMessage
  context?: MessageFeedContext
}) => {
  return (
    <MessageProvider message={message} context={context}>
      <div
        className="flex shrink-0 flex-col overflow-hidden rounded border bg-gray-2"
        style={{ contain: 'paint' }}
      >
        <MessageHeader />
        <MessageBody />
      </div>
    </MessageProvider>
  )
}
