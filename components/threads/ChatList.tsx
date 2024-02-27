'use client'

import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { PlusCircleIcon, SquareAsteriskIcon } from 'lucide-react'
import NextLink from 'next/link'
import { forwardRef } from 'react'

type ChatListProps = {
  threads?: Ent<'threads'>[]
} & React.ComponentProps<'div'>

export const ChatList = forwardRef<HTMLDivElement, ChatListProps>(function ChatList(
  { threads, className, ...props },
  forwardedRef,
) {
  const segment = '' //! temp

  return (
    <div
      {...props}
      className={cn('w-full overflow-hidden bg-gray-1', className)}
      ref={forwardedRef}
    >
      {/* title bar */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b bg-gray-1 px-1">
        <SquareAsteriskIcon className="size-5" />
        <Heading size="3">Chats</Heading>
      </div>

      <ThreadNavLink
        href="/thread"
        isActive={!segment}
        className="items-center gap-1.5 border-b text-gray-11"
      >
        <div className="font-medium">New chat</div>
        <PlusCircleIcon className="size-5" />
      </ThreadNavLink>

      {/* chat listing */}
      <ScrollArea>
        <div className="divide-y">
          {threads?.map((thread) => (
            <ThreadNavLink
              key={thread._id}
              href={`/thread/${thread._id}`}
              isActive={segment === thread._id}
              className="flex-col justify-center gap-1"
            >
              {/* info */}
              <div className="flex h-4 items-center justify-between gap-3 text-sm">
                <div className="overflow-hidden text-xs text-gray-10">
                  {thread.parameters?.model}
                </div>
                <div className="shrink-0 text-right text-gray-11">
                  {formatDistanceToNow(new Date(thread._creationTime), { addSuffix: true })}
                </div>
              </div>

              {/* title */}
              <div className="truncate font-medium text-gray-11">{thread.title}</div>
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
        className={cn('flex h-16 justify-center px-3 py-1', isActive && 'bg-gray-2', className)}
        ref={forwardedRef}
      >
        {children}
      </NextLink>
    )
  },
)
