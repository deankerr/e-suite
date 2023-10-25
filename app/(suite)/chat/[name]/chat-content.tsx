'use client'

import { ChatBarMenuItem } from '@/components/chat/menu'
import { sampleCode, sampleConvo, sampleMessages } from '@/components/chat/sample-data'
import { cn } from '@/lib/utils'
import { FaceIcon } from '@radix-ui/react-icons'
import { ChatForm } from './form/chatForm'
import { MessageBubble } from './message-bubble'
import { ChatTabData } from './types'
import { useChatApi } from './use-chat-api'

export function ChatContent({ chat }: { chat: ChatTabData }) {
  const chatHelpers = useChatApi(chat)
  const { setMessages, messages } = chatHelpers

  const hideForm = true
  return (
    <div className="chat-layout-content max-w-3xl space-y-4 border-r pb-2">
      <div className="grid grid-cols-5 px-3"></div>

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
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((m) => (
          <MessageBubble
            variant={m.role === 'user' ? 'local' : m.role === 'assistant' ? 'remote' : 'default'}
            content={m.content}
            key={m.id}
          />
        ))}
      </div>

      {/* Chat Form */}
      <ChatForm
        className={cn('w-full space-y-4', hideForm && '[&>*:not(:last-child)]:hidden')}
        handleSubmit={(values) => {
          console.log('submit', values)
          chatHelpers.append({ role: 'user', content: values.message })
        }}
      />
    </div>
  )
}
