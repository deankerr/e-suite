'use client'

import { useLocalStorage } from '@uidotdev/usehooks'
import { useState } from 'react'
import { InputPanel } from './components/InputPanel'
import { MessagePanel } from './components/MessagePanel'

export type ChatMessageItem = {
  role: 'system' | 'user' | 'assistant'
  name?: string
  content: string
}

export function Chat() {
  const [messages, setMessages] = useLocalStorage<ChatMessageItem[]>('dev-messages-1', [
    initialMessage,
  ])

  const submitMessage = async (content: string) => {
    const userMessage: ChatMessageItem = {
      role: ROLE.user,
      content,
    }
    const newMessages = [...messages, userMessage]

    const payload = {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      messages: newMessages,
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    const result = await response.json()
    console.log('result', result)

    if (typeof result === 'string') {
      const responseMessage = {
        role: ROLE.assistant,
        content: result,
      }
      newMessages.push(responseMessage)

      setMessages(newMessages)
    } else {
      console.error('invalid result:', result)
    }
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
