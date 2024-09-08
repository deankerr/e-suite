'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useThreads } from '@/app/lib/api/threads'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { IconButton } from '@/components/ui/Button'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { cn } from '@/lib/utils'

export const ChatsNavPanel = () => {
  const threads = useThreads()
  const params = useParams()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (isCollapsed) {
    return (
      <div className="absolute left-[3.75rem] top-2.5 z-10">
        <IconButton
          aria-label="Expand sidebar"
          variant="ghost"
          color="gray"
          className="hidden sm:flex"
          onClick={() => setIsCollapsed(false)}
        >
          <Icons.CaretRight size={20} />
        </IconButton>
      </div>
    )
  }

  return (
    <NavPanel className={cn(params.threadId && 'hidden sm:flex', isCollapsed && 'sm:hidden')}>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/chats">Chats</PanelTitle>

        <div className="grow" />
        <Link href="/chats/new">
          <Button variant="surface">
            Create <Icons.Plus size={20} />
          </Button>
        </Link>

        <IconButton
          aria-label="Collapse sidebar"
          variant="ghost"
          color="gray"
          onClick={() => setIsCollapsed(true)}
          className="ml-1 hidden sm:flex"
        >
          <Icons.CaretLeft size={20} />
        </IconButton>
      </PanelHeader>

      <VScrollArea>
        <div className="flex flex-col gap-1 overflow-hidden p-1">
          {threads?.map((thread) => (
            <Link
              key={thread._id}
              href={`/chats/${thread.slug}`}
              className={cn(
                'truncate rounded-sm px-2 py-3 text-sm font-medium hover:bg-gray-2',
                thread.slug === params.threadId && 'bg-gray-3 hover:bg-gray-3',
              )}
            >
              {thread.title ?? 'Untitled'}
            </Link>
          ))}
        </div>
      </VScrollArea>
    </NavPanel>
  )
}
