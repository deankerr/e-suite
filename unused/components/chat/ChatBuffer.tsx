'use client'

import { Flex } from '@radix-ui/themes'
import type { UseChatHelpers } from 'ai/react'
import { ChatBubble } from './ChatBubble'

type ChatBufferProps = {
  messages: UseChatHelpers['messages']
}

export const ChatBuffer = ({ messages }: ChatBufferProps) => {
  return (
    <Flex direction="column" grow="1" gap="4" p="4" className="overflow-y-auto">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
    </Flex>
  )
}
