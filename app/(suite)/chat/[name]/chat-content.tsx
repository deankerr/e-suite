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
    <div className="chat-layout-content max-w-3xl space-y-4 border-r py-4">
      {/* Messages Feed */}
      <div className="grid grid-flow-row grid-cols-[minmax(0,_0.75rem)_repeat(10,_minmax(0,_1fr))_minmax(0,_0.75rem)] gap-y-4">
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
