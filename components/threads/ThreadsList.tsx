'use client'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquarePlusIcon, MessageSquareTextIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { forwardRef } from 'react'
import { CShell } from '../ui/CShell'

type ThreadsListProps = {} & React.ComponentProps<'div'>

export const ThreadsList = forwardRef<HTMLDivElement, ThreadsListProps>(function ThreadsList(
  { className, ...props },
  forwardedRef,
) {
  const segment = useSelectedLayoutSegment()
  const threads = useQuery(api.threads.threads.list)
  return (
    <div
      {...props}
      className={cn('flex w-72 shrink-0 flex-col border-r bg-gray-1', className)}
      ref={forwardedRef}
    >
      <CShell.Titlebar className="px-2">
        <Heading size="3">Threads</Heading>
      </CShell.Titlebar>

      <ScrollArea className="grow">
        <div className="divide-y divide-gray-3">
          <NextLink
            className={cn(
              'grid h-14 grid-cols-[15%_1fr] place-content-center py-2 text-sm text-gray-12',
              !segment ? 'bg-gray-3 font-medium' : 'hover:bg-gray-2',
            )}
            href="/beta/thread"
          >
            <div className="flex items-center justify-center">
              <MessageSquarePlusIcon className="size-4" />
            </div>
            <div className="col-start-2 row-start-1 flex items-center">Create new thread</div>
          </NextLink>

          {threads?.map((thread) => (
            <NextLink
              key={thread._id}
              className={cn(
                'grid h-20 grid-cols-[15%_1fr] grid-rows-[1fr_1fr] place-content-center py-2 text-sm text-gray-11',
                segment === thread._id
                  ? 'bg-gray-3 text-gray-12'
                  : 'font-medium hover:bg-gray-2 hover:text-gray-12',
              )}
              href={`/beta/thread/${thread._id}`}
            >
              <div className="flex items-center justify-center">
                <MessageSquareTextIcon className="size-4" />
              </div>

              <div className="col-start-2 row-start-1 flex items-center font-medium">
                {thread.title}
              </div>
              <div className="col-start-2 row-start-2 flex">
                {formatDistanceToNow(new Date(thread._creationTime), { addSuffix: true })}
              </div>
            </NextLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
})
