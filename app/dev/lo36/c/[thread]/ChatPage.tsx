'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton, ScrollArea } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

import { Message } from '@/app/dev/lo36/c/[thread]/_components/Message'
import { Sidebar, SidebarSkeleton } from '@/app/dev/lo36/c/[thread]/_components/Sidebar'
import { Link } from '@/components/ui/Link'
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
        {/* * feed * */}
        <div className="mx-auto flex max-w-3xl flex-col-reverse items-center gap-0.5 overflow-hidden px-1.5 text-sm">
          <EndOfFeedIndicator />

          {/* * messages * */}
          {messages.results.map((message) => (
            <Message key={message._id} message={message} className="" />
          ))}

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
        </div>
      </ScrollArea>

      {/* * sidebar * */}
      <Sidebar thread={thread} className={cn(!showSidebar && 'hidden')} />
    </Shell>
  )
}

const EndOfFeedIndicator = () => {
  return (
    <div className="my-3 flex h-8 w-full shrink-0 items-center justify-center overflow-hidden">
      <div className="absolute right-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      <div className="absolute left-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      <Icons.SunHorizon className="size-6 rounded text-grayA-5" />
    </div>
  )
}

const ChatPageSkeleton = () => {
  return (
    <Shell>
      <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col items-center gap-3 overflow-hidden px-1.5 py-5">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="box-content flex max-h-7 w-full items-center gap-2">
            <Skeleton className="h-7 w-10 animate-none" />
            <Skeleton className="size-6 animate-none rounded-full" />
            <Skeleton className="h-7 w-full animate-none" />
          </div>
        ))}
      </div>
      <SidebarSkeleton />
    </Shell>
  )
}

const ChatPageError = () => {
  const router = useRouter()
  return (
    <Shell className="flex flex-col">
      <div className="m-auto flex flex-col items-center px-5">
        <Icons.Cat weight="thin" className="size-60 shrink-0 text-accentA-11" />

        <div
          className="p-3 text-center text-2xl"
          style={{ fontFamily: 'var(--font-chakra-petch)' }}
        >
          There doesn&apos;t appear to be anything here.
        </div>

        <div className="flex gap-4 p-2">
          <Link underline="always" color="brown" href="#" onClick={() => router.back()}>
            Go Back
          </Link>

          <Link underline="always" color="brown" href="/">
            Go Home
          </Link>
        </div>
      </div>
    </Shell>
  )
}
