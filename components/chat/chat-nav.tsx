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

  const chatTabs = user?.chatTabs ?? []
  const [optimisticChatTabs, modifyOptimisticChatTabs] = useOptimistic<ChatTab[], string | void>(
    chatTabs,
    (state, chatTabId) => {
      if (chatTabId) {
        return state.filter((t) => t.id !== chatTabId)
      } else {
        return [
          ...state,
          {
            id: `${Date.now()}`,
            userId: `${Date.now()}`,
            title: 'Untitled',
            slug: `${Date.now()}`,
            engineId: null,
          },
        ]
      }
    },
  )

  return (
    <nav className="flex items-center overflow-x-auto bg-muted/50">
      {optimisticChatTabs.map((t) => (
        <Link
          key={t.id}
          href={`/${t.slug}`}
          className={cn(
            'group flex h-full w-full max-w-[12rem] items-center border-t-primary bg-muted text-sm font-medium',
            encodeURI(t.slug) === segment
              ? 'border-t-2 bg-background'
              : 'opacity-50 hover:border-x hover:opacity-100',
          )}
        >
          {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
          <div className="w-[26px]"></div>
          <div className="w-full text-center">{t.title}</div>

          {/* dot / close button */}
          <div className="flex w-7 items-center">
            <Button
              variant="ghost"
              className="h-min w-min rounded-none p-0 hover:text-destructive"
              onClick={(e) => {
                e.preventDefault()
                startTransition(() => {
                  modifyOptimisticChatTabs(t.id)
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
              modifyOptimisticChatTabs()
              createChatTab(user?.id ?? '')
            })
          }}
        >
          <PlusIcon width={20} height={20} />
        </Button>
      )}
    </nav>
  )
}
