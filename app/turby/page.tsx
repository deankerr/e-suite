'use client'

import { Chat } from '@/components/Chat/Chat'
import { useIsClient } from '@uidotdev/usehooks'

export default function TurbyChatPage() {
  // stop Chat from rendering on server due to localStorage (?)
  const isClient = useIsClient()

  return isClient ? (
    <Chat
      model="gpt-3.5-turbo"
      provider="openai"
      prompt="You are a cheerful and helpful AI assistant named Turby. Use Markdown."
      title="turby's tavern"
      names={{ user: 'Greg', assistant: 'Turby' }}
    />
  ) : null
}
