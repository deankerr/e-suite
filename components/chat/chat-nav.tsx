'use client'

import { ChatTab, User } from '@/lib/db'
import { cn } from '@/lib/utils'
import { Cross1Icon, DotFilledIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'
import { Button } from '../ui/button'
import { createChatTab, deleteChatTab } from './actions'

export function ChatNav({ user }: { user: User }) {
  let [isPending, startTransition] = useTransition()
  const segment = useSelectedLayoutSegment()

  const [chatTabs, addOptimisticChatTab] = useOptimistic<ChatTab[], ChatTab | string>(
    user?.chatTabs ?? [],
    (state, newChatTab) => {
      if (typeof newChatTab === 'string') {
        return state.filter((t) => t.id !== newChatTab)
      } else return [...state, newChatTab]
    },
  )

  return (
    <nav className="flex items-center overflow-x-auto bg-muted">
      {chatTabs.map((t) => (
        <Link
          key={t.id}
          href={`/${t.name}`}
          className={cn(
            'group flex h-full w-full max-w-[12rem] items-center border-r-border border-t-primary text-sm font-medium',
            encodeURI(t.name) === segment && 'border-t-2 bg-background',
          )}
        >
          {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
          <div className="w-[26px]"></div>
          <div className="w-full text-center">{t.name}</div>

          {/* dot / close button */}
          <div className="flex w-7 items-center">
            <Button
              variant="ghost"
              className="h-min w-min rounded-none p-0 hover:text-destructive"
              onClick={(e) => {
                e.preventDefault()
                startTransition(() => {
                  addOptimisticChatTab(t.id)
                  deleteChatTab(t.id)
                })
              }}
            >
              <DotFilledIcon className="group-hover:hidden" />
              <Cross1Icon width={16} height={16} className="hidden group-hover:inline-flex" />
            </Button>
          </div>
        </Link>
      ))}

      {/* add new */}
      {user && (
        <Button
          variant="ghost"
          className="h-full rounded-none px-1 hover:text-primary"
          onClick={() => {
            startTransition(() => {
              addOptimisticChatTab({ id: `${Date.now()}`, name: 'Untitled' } as ChatTab)
              createChatTab(user?.id ?? '', `Untitled ${chatTabs.length + 1}`)
            })
          }}
        >
          <PlusIcon width={20} height={20} />
        </Button>
      )}
    </nav>
  )
}
