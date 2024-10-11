'use client'

import { MessageBody } from './MessageBody'
import { MessageHeader } from './MessageHeader'
import { MessageProvider } from './MessageProvider'

import type { EMessage } from '@/convex/types'

export const Message = ({ message }: { message: EMessage }) => {
  return (
    <MessageProvider message={message}>
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
