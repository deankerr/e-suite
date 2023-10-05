'use client'

import { useIsClient } from '@uidotdev/usehooks'
import { Chat } from './Chat'
import { HeaderBar } from './components/HeaderBar'

export default function ChatPage() {
  // stop Chat from rendering on server due to lsocalStorage (?)
  const isClient = useIsClient()
  if (isClient === false) {
    return null
  }

  return (
    <div className="h-screen overflow-hidden">
      <Chat />
    </div>
  )
}

// bg-[url('/backgrounds/shapes.svg')] bg-[length:60px_60px]
