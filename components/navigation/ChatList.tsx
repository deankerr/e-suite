'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { MessageSquareIcon, PlusCircleIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegments } from 'next/navigation'
import { forwardRef } from 'react'
import { Button } from '../ui/Button'
import { ItemLink } from './ItemLink'

type ChatListProps = {} & React.ComponentProps<typeof ScrollArea>

export const ChatList = forwardRef<HTMLDivElement, ChatListProps>(function ChatList(
  { className, ...props },
  forwardedRef,
) {
  const [route, routeId] = useSelectedLayoutSegments()
  const isActive = (slug?: string) => route === 'chat' && routeId === slug

  const threadsList = useQuery(api.threads.threads.list, {})

  return (
    <div className="flex grow flex-col overflow-hidden">
      {/* new */}
      <div className="flex flex-col px-2.5 pb-2 pt-2.5 shadow-md">
        <Button size="3" variant="surface" className="flex-between" asChild>
          <NextLink href={'/chat'}>
            <div className="w-4">
              <PlusCircleIcon className="size-4" />
            </div>
            <div>Create</div>
            <div className="w-4"></div>
          </NextLink>
        </Button>
      </div>
      {/* list */}
      <ScrollArea
        {...props}
        ref={forwardedRef}
        scrollbars="vertical"
        className={cn('grow', className)}
      >
        <div className="w-80 px-1.5">
          <div className="flex flex-col gap-0.5 px-1">
            {threadsList?.map(({ _id, title }) => (
              <ItemLink
                key={_id}
                href={`/chat/${_id}`}
                title={title ?? '...'}
                icon={<MessageSquareIcon className="size-5 stroke-[1.5]" />}
                isActive={isActive(_id)}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
})

// {formatModelString(parameters?.model)}
// function formatModelString(model?: string) {
//   return model ? `${model.split('/')[1]}` : ''
// }
