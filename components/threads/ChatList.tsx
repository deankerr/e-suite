'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { useChatListOpenAtom } from '@/components/atoms'
import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { PlusCircleIcon, XIcon } from 'lucide-react'
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

  const { isOpen, close } = useChatListOpenAtom()

  return (
    <div
      {...props}
      className={cn(
        'absolute z-10 h-full w-full translate-x-0 overflow-hidden bg-gray-1 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className,
      )}
      ref={forwardedRef}
    >
      {/* title bar */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-1 border-b bg-gray-1 px-1">
        <Heading size="3">Chats</Heading>
        <IconButton lucideIcon={XIcon} variant="ghost" className="m-0" onClick={close} />
      </div>

      <ThreadNavLink
        href="/chat"
        isActive={!segment}
        className="items-center gap-1.5 border-b text-gray-11"
        onClick={close}
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
              href={`/chat/${thread._id}`}
              isActive={segment === thread._id}
              className="flex-col justify-center gap-1"
              onClick={close}
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
