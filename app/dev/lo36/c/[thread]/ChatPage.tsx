'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton, ScrollArea } from '@radix-ui/themes'

import { Message } from '@/app/dev/lo36/c/[thread]/_components/Message'
import { Sidebar, SidebarSkeleton } from '@/app/dev/lo36/c/[thread]/_components/Sidebar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMessagesList, useThread } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { ClassNameValue } from '@/lib/utils'

const Shell = ({
  className,
  children,
}: {
  className?: ClassNameValue
  children: React.ReactNode
}) => {
  return <div className={cn('flex h-full w-full', className)}>{children}</div>
}

const ChatPageSkeleton = () => {
  const MsgSkl = () => (
    <div className="flex w-full gap-2">
      <Skeleton className="size-7 animate-none rounded-full" />
      <Skeleton className="h-7 w-full animate-none" />
    </div>
  )

  return (
    <Shell>
      <div className="mx-auto flex w-full max-w-2xl animate-pulse flex-col items-center gap-5 overflow-hidden px-5 py-5">
        {[...Array(30)].map((_, i) => (
          <MsgSkl key={i} />
        ))}
      </div>
      <SidebarSkeleton />
    </Shell>
  )
}

const ChatPageError = () => {
  return <Shell>Error</Shell>
}

export const ChatPage = ({
  slug,
  className,
  ...props
}: { slug: string } & React.ComponentProps<'div'>) => {
  const thread = useThread({ slug })
  const messages = useMessagesList({ slugOrId: slug })

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <ChatPageSkeleton />

  return (
    <Shell {...props} className={className}>
      <ScrollArea scrollbars="vertical" className="">
        {/* * loader button * */}
        <div className="mt-3 flex justify-center">
          <IconButton
            variant="surface"
            onClick={() => {
              if (messages.status === 'CanLoadMore') {
                messages.loadMore(100)
              }
            }}
            disabled={messages.status !== 'CanLoadMore'}
            size="3"
            className=""
          >
            <Icons.DiamondsFour className={cn('size-6', messages.isLoading && 'animate-spin')} />
          </IconButton>
        </div>

        {/* * feed * */}
        <div className="flex max-w-full flex-col-reverse items-center gap-0.5 overflow-hidden px-3 text-sm">
          {messages.results.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        </div>

        <div className="my-3 flex shrink-0 justify-center">
          <Icons.SunHorizon className="mx-auto my-2 size-6 text-grayA-8" />
        </div>
      </ScrollArea>

      {/* * sidebar * */}
      <Sidebar thread={thread} />
    </Shell>
  )
}
