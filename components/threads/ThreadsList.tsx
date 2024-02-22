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
        'absolute z-10 flex h-full w-72 shrink-0 -translate-x-72 flex-col border-r bg-gray-1 transition-transform duration-300 lg:static lg:translate-x-0',
        sidebarOpen && 'translate-x-0',
        className,
      )}
      ref={forwardedRef}
    >
      <CShell.Titlebar className="lg:px-2">
        <IconButton
          variant="ghost"
          className={cn('m-0 lg:hidden', !sidebarOpen && 'fixed left-72 top-1 bg-gray-1')}
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
            lg: '3',
          }}
        >
          Threads
        </Heading>
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
