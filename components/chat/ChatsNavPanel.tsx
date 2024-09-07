'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useThreads } from '@/app/lib/api/threads'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { NavPanel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { cn } from '@/lib/utils'

export const ChatsNavPanel = () => {
  const threads = useThreads()
  const params = useParams()

  return (
    <NavPanel>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href="/chats">Chats</PanelTitle>

        <div className="grow" />
        <Link href="/chats/new">
          <Button variant="surface">
            Create <Icons.Plus size={18} />
          </Button>
        </Link>
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
