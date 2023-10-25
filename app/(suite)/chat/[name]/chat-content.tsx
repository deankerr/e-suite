'use client'

import { ChatBarMenuItem } from '@/components/chat/menu'
import { ChatMessageBubble } from '@/components/chat/message-bubble'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { FaceIcon } from '@radix-ui/react-icons'
import { ChatForm } from './form/chatForm'
import { ChatTabData } from './types'
import { useChatApi } from './use-chat-api'

export function ChatContent({ chat }: { chat: ChatTabData }) {
  const chatHelpers = useChatApi(chat)
  const { setMessages } = chatHelpers
  return (
    <div className="chat-layout-content">
      <ChatBarMenuItem
        className="rounded-none border-none"
        label={<FaceIcon />}
        heading="Debug"
        items={[
          ['Add lorem', () => setMessages([...sampleConvo])],
          ['Add code', () => setMessages([...sampleCode])],
          ['Add markdown', () => setMessages([...sampleMessages])],
        ]}
      />
      {chatHelpers.messages.map((m) => (
        <ChatMessageBubble message={m} key={m.id} />
      ))}

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
