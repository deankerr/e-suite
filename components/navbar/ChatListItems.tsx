'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { MessageSquareIcon } from 'lucide-react'
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
  const active = (slug: string) => route === 'chat' && routeId === slug

  const threads = usePreloadedQuery(preload)

  return (
    <ScrollArea
      {...props}
      scrollbars="vertical"
      className={cn('h-full grow', className)}
      ref={forwardedRef}
    >
      <div className="flex flex-col-reverse divide-y divide-gray-5">
        {threads?.map((thread) => (
          <NextLink
            key={thread._id}
            href={`/chat/${thread._id}`}
            className={cn(
              'flex h-16 w-80 shrink-0 items-center gap-1 overflow-hidden py-3 pr-3',
              active(thread._id) ? 'bg-gray-2' : 'hover:bg-gray-2',
            )}
          >
            {/* icon */}
            <div className="flex shrink-0 flex-col justify-center px-4">
              <MessageSquareIcon
                className={cn('size-5 text-gray-11', active(thread._id) && 'text-gray-12')}
              />
            </div>

            <div className="flex flex-col gap-1">
              {/* model name */}
              <div className={cn('text-xs text-gray-10', active(thread._id) && 'text-gray-11')}>
                {formatModelString(thread.parameters?.model)}
              </div>

              {/* title */}
              <div
                className={cn(
                  'truncate text-sm font-medium text-gray-11',
                  active(thread._id) && 'text-gray-12',
                )}
              >
                {thread.title}
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
