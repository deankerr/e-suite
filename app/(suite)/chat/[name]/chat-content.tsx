'use client'

import { ChatMessageBubble } from '@/components/chat/message-bubble'
import { DynamicTextarea } from '@/components/dynamic-textarea'
import { ChatForm } from './form/chatForm'
import { ChatTabData } from './types'
import { useChatApi } from './use-chat-api'

export function ChatContent({ chat }: { chat: ChatTabData }) {
  const chatHelpers = useChatApi(chat)

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center space-y-4 border">
        {chatHelpers.messages.map((m) => (
          <ChatMessageBubble message={m} key={m.id} />
        ))}
      </div>
      <br />
      {/* Form */}
      <ChatForm className="w-full space-y-4" />
      <DynamicTextarea />
    </div>
  )
}
