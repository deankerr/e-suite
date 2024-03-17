'use client'

import { Ent } from '@/convex/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { MessageSquareIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { forwardRef } from 'react'

type ChatMenuBarListProps = {
  threads?: Ent<'threads'>[]
} & React.ComponentProps<typeof ScrollArea>

export const ChatMenuBarList = forwardRef<HTMLDivElement, ChatMenuBarListProps>(
  function ChatMenuBarList({ threads, className, ...props }, forwardedRef) {
    const [route, routeId] = useSelectedLayoutSegments()
    const active = (slug: string) => route === 'chat' && routeId === slug

    return (
      <ScrollArea {...props} scrollbars="vertical" className={cn('', className)} ref={forwardedRef}>
        <div className="flex flex-col-reverse divide-y">
          {threads?.map((thread) => (
            <NextLink
              key={thread._id}
              href={`/chat/${thread._id}`}
              className={cn(
                'flex h-12 shrink-0 items-center gap-1 overflow-hidden py-3',
                active(thread._id) ? 'bg-gray-2' : 'hover:bg-gray-2',
              )}
              onClick={close}
            >
              {/* icon */}
              <div className="flex shrink-0 flex-col justify-center px-4">
                <MessageSquareIcon
                  className={cn('size-5 text-gray-11', active(thread._id) && 'text-gray-12')}
                />
              </div>

              <div className="flex flex-col gap-1">
                {/* time */}
                {/* <div className="shrink-0 text-right text-xs text-gray-11">
                  {formatDistanceToNow(new Date(thread._creationTime), { addSuffix: true })}
                </div> */}

                {/* model name */}
                <div className={cn('text-xs text-gray-10', active(thread._id) && 'text-gray-11')}>
                  {formatModelString(thread.parameters?.model)}
                </div>

                {/* title */}
                <div
                  className={cn(
                    'text-sm font-medium text-gray-11',
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
  },
)

function formatModelString(model?: string) {
  return model ? `${model.split('/')[1]}` : ''
}
