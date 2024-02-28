'use client'

import { IconButton } from '@/app/components/ui/IconButton'
import { useChatListOpenAtom } from '@/components/atoms'
import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { PlusCircleIcon, XIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { forwardRef } from 'react'

type ChatListProps = {
  threads?: Ent<'threads'>[]
} & React.ComponentProps<'div'>

export const ChatList = forwardRef<HTMLDivElement, ChatListProps>(function ChatList(
  { threads, className, ...props },
  forwardedRef,
) {
  const segment = useSelectedLayoutSegment()
  const active = (slug: string) => segment === slug

  const { isOpen, close } = useChatListOpenAtom()

  return (
    <div
      {...props}
      className={cn(
        'absolute z-10 h-full w-full translate-x-0 overflow-hidden bg-gray-1 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:static md:w-96 md:translate-x-0 md:border-r',
        className,
      )}
      ref={forwardedRef}
    >
      {/* title bar */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-1 border-b bg-gray-1 pl-2.5 pr-1">
        <Heading size="3">Chats</Heading>
        <IconButton lucideIcon={XIcon} variant="ghost" className="m-0 md:hidden" onClick={close} />
      </div>

      <NextLink
        href="/chat"
        className={cn(
          'flex h-12 items-center justify-center gap-1.5 border-b text-gray-11 hover:bg-gray-2',
          !segment && 'bg-gray-2',
        )}
        onClick={close}
      >
        <div className="font-medium">New chat</div>
        <PlusCircleIcon className="size-5" />
      </NextLink>

      {/* chat listing */}
      <ScrollArea>
        <div className="divide-y">
          {threads?.map((thread) => (
            <NextLink
              key={thread._id}
              href={`/chat/${thread._id}`}
              className={cn(
                'flex h-16 flex-col justify-center gap-1.5 px-2 py-1',
                active(thread._id) ? 'bg-gray-2' : 'hover:bg-gray-2',
              )}
              onClick={close}
            >
              <div className="flex">
                {/* model name */}
                <div className="grow text-xs text-gray-10">
                  {formatModelString(thread.parameters?.model)}
                </div>

                {/* time */}
                <div className="shrink-0 text-right text-xs text-gray-11">
                  {formatDistanceToNow(new Date(thread._creationTime), { addSuffix: true })}
                </div>
              </div>

              {/* title */}
              <div className="text-sm font-medium text-gray-11">{thread.title}</div>
            </NextLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})

function formatModelString(model?: string) {
  return model ? `${model.split('/')[1]}` : ''
}
