'use client'

import { useIsClient } from '@uidotdev/usehooks'
import { ThemePicker } from '../../components/ThemePicker'
import { Chat } from './Chat'
import { HeaderBar } from './HeaderBar'

export default function ChatPage() {
  // stop Chat from rendering on server due to localStorage (?)
  const isClient = useIsClient()
  if (isClient === false) {
    return null
  }

  return (
    // <div className="h-[100dvh] overflow-hidden">
    <div className="">
      <Chat />
      {/* <div className="fixed left-2 top-2">
        <ThemePicker />
      </div> */}
    </div>
  )
}
