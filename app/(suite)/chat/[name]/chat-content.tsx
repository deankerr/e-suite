'use client'

import { cn } from '@/lib/utils'
import { ChatForm } from './form/chatForm'
import { MessageBubble } from './message-bubble'
import { ChatTabData } from './types'
import { ChatHelpers } from './use-chat-api'

export function ChatContent({
  chat,
  chatHelpers,
}: {
  chat: ChatTabData
  chatHelpers: ChatHelpers
}) {
  const { setMessages, messages } = chatHelpers

  const hideForm = true
  return (
    <div className="chat-layout-content max-w-3xl space-y-4 border-r pb-2">
      <div className="grid grid-cols-5 px-3"></div>

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
