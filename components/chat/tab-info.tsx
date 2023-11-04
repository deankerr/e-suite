'use client'

import { ChatTab, User } from '@/lib/db'

export function TabInfo({ user, chatTab }: { user?: User; chatTab?: ChatTab }) {
  return (
    <div className="w-fit rounded-md border p-2 text-sm">
      <p>
        Info: {chatTab?.id} {chatTab?.title}
      </p>
      <p>Current model: {chatTab?.engineId ?? 'not selected'}</p>
    </div>
  )
}
