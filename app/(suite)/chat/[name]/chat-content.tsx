'use client'

import { ChatMessageBubble } from '@/components/chat/message-bubble'
import { ChatForm } from './form/chatForm'
import { ChatTabData } from './types'
import { useChatApi } from './use-chat-api'

export function ChatContent({ chat }: { chat: ChatTabData }) {
  const chatHelpers = useChatApi(chat)

  return (
    <div className="chat-tab-content overflow-y-auto">
      <div className="flex flex-col items-center space-y-4 border">
        {chatHelpers.messages.map((m) => (
          <ChatMessageBubble message={m} key={m.id} />
        ))}
      </div>
      <br />
      {/* Form */}
      <ChatForm
        className="w-full space-y-4"
        handleSubmit={(values) => {
          console.log('submit', values)
          chatHelpers.append({ role: 'user', content: values.message })
        }}
      />
    </div>
  )
}
