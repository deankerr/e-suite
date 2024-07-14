'use client'

import { useState } from 'react'
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

  const [showSidebar, setShowSidebar] = useState(true)

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <ChatPageSkeleton />

  // const msg0 = messages.results[0]
  return (
    <Shell {...props} className={className}>
      <ScrollArea scrollbars="vertical">
        {/* * loader button * */}
        <div className={cn('mt-3 flex justify-center', '')}>
          <IconButton
            variant="surface"
            onClick={() => {
              if (messages.status === 'CanLoadMore') {
                messages.loadMore(100)
              }
            }}
            disabled={messages.status !== 'CanLoadMore'}
            size="2"
            className=""
          >
            <Icons.DiamondsFour className={cn('size-5', messages.isLoading && 'animate-spin')} />
          </IconButton>
        </div>

        {/* * feed * */}
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-0.5 overflow-hidden px-1.5 text-sm">
          {messages.results.map((message) => (
            <Message key={message._id} message={message} className="" />
          ))}

          <div className="my-3 flex h-8 w-full shrink-0 items-center justify-center overflow-hidden">
            <div className="absolute right-[55%] top-1/2 h-px w-[40%] bg-grayA-5" />
            <div className="absolute left-[55%] top-1/2 h-px w-[40%] bg-grayA-5" />

            <Icons.SunHorizon className="size-6 rounded text-grayA-5" />
          </div>
        </div>
      </ScrollArea>

      {/* * sidebar * */}
      <Sidebar thread={thread} className={cn(!showSidebar && 'hidden')} />
    </Shell>
  )
}
