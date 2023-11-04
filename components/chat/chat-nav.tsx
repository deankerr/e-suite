'use client'

import { ChatTab, User } from '@/lib/db'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'
import { Button } from '../ui/button'
import { createChatTab } from './actions'
import { TabTop } from './tab-top'

export function ChatNav({ user }: { user: User }) {
  let [isPending, startTransition] = useTransition()
  const segment = useSelectedLayoutSegment()

  const [chatTabs, addOptimisticChatTab] = useOptimistic<ChatTab[], ChatTab>(
    user?.chatTabs ?? [],
    (state, newChatTab) => [...state, newChatTab],
  )

  return (
    <nav className="flex overflow-x-auto bg-muted">
      {chatTabs.map((t) => (
        <TabTop key={t.id} title={t.name} segActive={encodeURI(t.name) === segment} />
      ))}
      {user && (
        <Button
          onClick={() => {
            startTransition(() => {
              addOptimisticChatTab({ id: `${Date.now()}`, name: 'Untitled' } as ChatTab)
              createChatTab(user?.id ?? '', `Untitled ${chatTabs.length + 1}`)
            })
          }}
        >
          add
        </Button>
      )}
    </nav>
  )
}
