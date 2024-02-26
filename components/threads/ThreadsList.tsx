'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageSquarePlusIcon,
  MessageSquareTextIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { forwardRef, useState } from 'react'
import { CShell } from '../ui/CShell'

type ThreadsListProps = {} & React.ComponentProps<'div'>

export const ThreadsList = forwardRef<HTMLDivElement, ThreadsListProps>(function ThreadsList(
  { className, ...props },
  forwardedRef,
) {
  const segment = useSelectedLayoutSegment()
  const threads = useQuery(api.threads.threads.list)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div
      {...props}
      className={cn(
        'absolute z-10 flex h-full w-60 shrink-0 -translate-x-60 flex-col border-r bg-gray-1 transition-all duration-300 md:static md:translate-x-0',
        sidebarOpen && 'translate-x-0',
        className,
      )}
      ref={forwardedRef}
    >
      <CShell.Titlebar className="lg:px-2">
        <IconButton
          variant="ghost"
          className={cn('m-0 lg:hidden', !sidebarOpen && 'fixed left-60 top-1 bg-gray-1')}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <PanelLeftCloseIcon className="stroke-[1.75]" />
          ) : (
            <PanelLeftOpenIcon className="stroke-[1.75]" />
          )}
        </IconButton>
        <Heading
          size={{
            initial: '1',
            sm: '2',
          }}
        >
          Chats
        </Heading>
      </CShell.Titlebar>

      <ScrollArea className="grow">
        <div className="divide-y divide-gray-3">
          <ThreadNavLink href="/thread" isActive={!segment}>
            <MessageSquarePlusIcon className="size-4" />
            <div className="font-medium">Create new chat</div>
          </ThreadNavLink>

          {threads?.map((thread) => (
            <ThreadNavLink
              key={thread._id}
              href={`/thread/${thread._id}`}
              isActive={segment === thread._id}
            >
              <MessageSquareTextIcon className="size-4" />

              <div className="space-y-1">
                <div className="font-medium">{thread.title}</div>
                <div className="text-xs">
                  {formatDistanceToNow(new Date(thread._creationTime), { addSuffix: true })}
                </div>
              </div>
            </ThreadNavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

type ThreadNavLinkProps = {
  isActive?: boolean
} & Partial<React.ComponentProps<typeof NextLink>>

export const ThreadNavLink = forwardRef<HTMLAnchorElement, ThreadNavLinkProps>(
  function ThreadNavLink({ isActive, children, className, ...props }, forwardedRef) {
    return (
      <NextLink
        href="#"
        {...props}
        className={cn(
          'flex h-16 items-center gap-3 bg-gray-1 px-3 text-sm text-gray-11',
          isActive ? 'bg-gray-3 text-gray-12' : 'hover:bg-gray-2',
          className,
        )}
        ref={forwardedRef}
      >
        {children}
      </NextLink>
    )
  },
)
