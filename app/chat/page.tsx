'use client'

import { Chat } from '@/components/Chat/Chat'
import { useIsClient } from '@uidotdev/usehooks'

export default function ChatPage() {
  // stop Chat from rendering on server due to localStorage (?)
  const isClient = useIsClient()

  return isClient ? (
    <Chat model="gpt-4" provider="openai" prompt="You are a helpful AI assistant." />
  ) : null
}
