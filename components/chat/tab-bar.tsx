'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatTab, User } from '@/lib/db'
import { cn } from '@/lib/utils'
import { Cross1Icon, DotFilledIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { redirect, useRouter, useSelectedLayoutSegment } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { createChatTab, deleteChatTab, renameChatTab } from './actions'

export function TabBar({ user }: { user?: User }) {
  const router = useRouter()
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
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]
      }
    },
  )

  return (
    <nav className="flex items-center overflow-x-auto bg-muted/50">
      {optimisticChatTabs
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((t) => {
          const isActive = t.slug === segment
          return (
            <Link
              key={t.id}
              href={`/${t.slug}`}
              className={cn(
                'group flex h-full w-full max-w-[12rem] items-center border-t-primary bg-muted text-sm font-medium',
                isActive
                  ? 'border-t-2 bg-background'
                  : 'opacity-50 hover:border-x hover:opacity-100',
              )}
            >
              {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
              <div className="w-[26px]"></div>
              <div
                className="w-full text-center"
                onClick={(e) => {
                  if (!isActive) return
                }}
              >
                <EditTitlePopover
                  enabled={isActive}
                  currentTitle={t.title}
                  onClose={(title) =>
                    startTransition(() =>
                      renameChatTab(t.id, title).then((newSlug) => redirect(`/${newSlug}`)),
                    )
                  }
                >
                  <p className={isActive ? 'group-hover:underline' : ''}>{t.title}</p>
                </EditTitlePopover>
              </div>

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
          )
        })}

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

function EditTitlePopover({
  currentTitle = 'Untitled',
  enabled,
  onClose,
  children,
}: {
  currentTitle?: string
  enabled?: boolean
  onClose: (title: string) => void
  children: React.ReactNode
}) {
  const [newTitle, setNewTitle] = useState(currentTitle)

  if (enabled === false) return children

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && newTitle && newTitle !== currentTitle) onClose(newTitle)
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Name</h4>
            <p className="text-sm text-muted-foreground">Set the name for this tab.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Name</Label>
              <Input
                id="title"
                className="col-span-2 h-8"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
