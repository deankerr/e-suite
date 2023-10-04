'use client'

import { useState } from 'react'
import { InputPanel } from './components/InputPanel'
import { MessagePanel } from './components/MessagePanel'

export type ChatMessageItem = {
  role: 'system' | 'user' | 'assistant'
  name?: string
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([initialMessage])

  const submitMessage = (content: string) => {
    const message = {
      role: ROLE.user,
      content,
    }
    const newMessages = [...messages, message]
    setMessages(newMessages)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-end border-base-200 bg-base-100 bg-[url('/backgrounds/shapes.svg')] bg-[length:60px_60px] pb-32 pt-4">
      <MessagePanel messages={messages} />
      <InputPanel handleSubmit={submitMessage} />
    </div>
  )
}

const ROLE = {
  system: 'system',
  user: 'user',
  assistant: 'assistant',
} as const

const initialMessage = {
  role: 'system',
  content: 'This is the start of the chat.',
} as const
