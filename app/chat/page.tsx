'use client'

import { useIsClient } from '@uidotdev/usehooks'
import { Chat } from './Chat'

export default function ChatPage() {
  // stop Chat from rendering on server due to localStorage (?)
  const isClient = useIsClient()

  return isClient ? <Chat /> : null
}
