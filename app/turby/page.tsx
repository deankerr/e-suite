'use client'

import { Chat } from '@/components/Chat/Chat'
import { useIsClient } from '@uidotdev/usehooks'

export default function TurbyChatPage() {
  // stop Chat from rendering on server due to localStorage (?)
  const isClient = useIsClient()

  return isClient ? (
    <Chat
      model="openai/gpt-3.5-turbo"
      provider="openrouter"
      prompt="You are a helpful AI assistant named Turby. Use Markdown in your responses."
      title="turbys tavern"
      names={{ user: 'Greg', assistant: 'Turby' }}
    />
  ) : null
}
