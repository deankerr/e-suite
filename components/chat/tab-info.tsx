'use client'

import { User } from '@/lib/db'
import { useSelectedLayoutSegment } from 'next/navigation'

export function TabInfo({ user }: { user: User }) {
  const segment = useSelectedLayoutSegment()
  const chatTab = user && user.chatTabs.find((tab) => encodeURI(tab.name) === segment)
  return (
    <div className="w-fit rounded-md border p-2 text-sm">
      <p>
        Info: {chatTab?.id} {chatTab?.name}
      </p>
      <p>Current model: {chatTab?.engineId ?? 'not selected'}</p>
    </div>
  )
}
