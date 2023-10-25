'use client'

import { ChatBarMenuItem } from '@/components/chat/menu'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { FaceIcon } from '@radix-ui/react-icons'
import { ChatForm } from './form/chatForm'
import { MessageBubble } from './message-bubble'
import { ChatTabData } from './types'
import { useChatApi } from './use-chat-api'

export function ChatContent({ chat }: { chat: ChatTabData }) {
  const chatHelpers = useChatApi(chat)
  const { setMessages, messages } = chatHelpers
  return (
    <div className="chat-layout-content space-y-4">
      <ChatBarMenuItem
        className="rounded-none border-none"
        label={<FaceIcon />}
        heading="Debug"
        items={[
          ['Add lorem', () => setMessages([...messages, ...sampleConvo])],
          ['Add code', () => setMessages([...messages, ...sampleCode])],
          ['Add markdown', () => setMessages([...messages, ...sampleMessages])],
        ]}
      />

      {/* Messages Feed */}
      {messages.map((m) => (
        <MessageBubble
          variant={m.role === 'user' ? 'local' : m.role === 'assistant' ? 'remote' : 'default'}
          content={m.content}
          key={m.id}
        />
      ))}

      {/* Chat Form */}
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
