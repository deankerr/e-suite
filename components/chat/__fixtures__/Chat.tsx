'use client'

import { Chat } from '@/components/chat/Chat'

export default function Fixture() {
  return (
    <div className="w-full">
      <Chat threadId="new" />
    </div>
  )
}
