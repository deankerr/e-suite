'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { MessageCirclePlusIcon, MessageSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { forwardRef } from 'react'

type ChatListItemsProps = {
  preload: Preloaded<typeof api.threads.threads.list>
} & React.ComponentProps<typeof ScrollArea>

export const ChatListItems = forwardRef<HTMLDivElement, ChatListItemsProps>(function ChatListItems(
  { preload, className, ...props },
  forwardedRef,
) {
  const [route, routeId] = useSelectedLayoutSegments()
  const isActive = (slug?: string) => route === 'chat' && routeId === slug

  const threads = usePreloadedQuery(preload)

  return (
    <ScrollArea
      {...props}
      scrollbars="vertical"
      className={cn('grow', className)}
      ref={forwardedRef}
    >
      <NextLink
        href={`/chat`}
        className={cn(
          'flex-between h-16 gap-1 px-4 hover:bg-gray-2',
          isActive(undefined) && 'bg-gray-2',
        )}
      >
        <MessageCirclePlusIcon />
        <Heading size="3" className="grow px-4">
          New Chat
        </Heading>
      </NextLink>
      <div className="flex flex-col-reverse divide-y divide-gray-5">
        {threads?.map(({ _id, title, parameters }) => (
          <NextLink
            key={_id}
            href={`/chat/${_id}`}
            className={cn(
              'flex h-16 w-screen shrink-0 items-center gap-1 overflow-hidden py-3 pr-3 sm:w-80',
              isActive(_id) ? 'bg-gray-2' : 'hover:bg-gray-2',
            )}
          >
            {/* icon */}
            <div className="flex shrink-0 flex-col justify-center px-4">
              <MessageSquareIcon
                className={cn('size-5 text-gray-11', isActive(_id) && 'text-gray-12')}
              />
            </div>

            {/* details */}
            <div className="flex flex-col gap-1">
              {/* title */}
              <Heading
                size="2"
                className={cn('truncate text-gray-11', isActive(_id) && 'text-gray-12')}
              >
                {title}
              </Heading>

              {/* model name */}
              <div className={cn('text-xs text-gray-10', isActive(_id) && 'text-gray-11')}>
                {formatModelString(parameters?.model)}
              </div>
            </div>
          </NextLink>
        ))}
      </div>
    </ScrollArea>
  )
})

function formatModelString(model?: string) {
  return model ? `${model.split('/')[1]}` : ''
}
