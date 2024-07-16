'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, ScrollArea } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

import { Composer } from '@/app/dev/lo36/c/[thread]/_components/composer/Composer'
import { Message } from '@/app/dev/lo36/c/[thread]/_components/Message'
import { Sidebar, SidebarSkeleton } from '@/app/dev/lo36/c/[thread]/_components/Sidebar'
import { ChatProvider, useChat } from '@/app/dev/lo36/c/[thread]/_provider/ChatProvider'
import { Link } from '@/components/ui/Link'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

import type { ClassNameValue } from '@/lib/utils'

const Shell = ({
  className,
  children,
}: {
  className?: ClassNameValue
  children: React.ReactNode
}) => {
  return <div className={cn('flex h-full w-full bg-gray-1', className)}>{children}</div>
}

const Component = () => {
  const { thread, messages } = useChat()

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <ChatPageSkeleton />

  return (
    <Shell>
      <div className="flex h-full w-full flex-col">
        <ScrollArea scrollbars="vertical">
          {/* * feed * */}
          <div className="mx-auto flex max-w-3xl flex-col-reverse items-center gap-0.5 overflow-hidden px-1.5 text-sm">
            <EndOfFeedIndicator />

            {/* * messages * */}
            {messages.map((message) => (
              <Message key={message._id} message={message} className="" />
            ))}

            <LoadMoreButton />
          </div>
        </ScrollArea>
        <Composer className="border-t" />
      </div>

      {/* * sidebar * */}
      <Sidebar thread={thread} />
    </Shell>
  )
}

export const ChatPage = ({ slug, onClose }: { slug: string; onClose?: (slug: string) => void }) => {
  return (
    <ChatProvider slug={slug} onClose={onClose}>
      <Component />
    </ChatProvider>
  )
}

const LoadMoreButton = () => {
  const { page, loadMoreMessages } = useChat()

  if (page.status === 'Exhausted') return <EndOfFeedIndicator position="end" />

  return (
    <div className="flex h-12 w-full items-center justify-center">
      <Button
        variant="surface"
        size="1"
        className="w-48"
        disabled={page.status !== 'CanLoadMore'}
        onClick={() => loadMoreMessages()}
      >
        {page.isLoading ? (
          <Icons.CircleNotch className="size-4 animate-spin" />
        ) : (
          'Load More Messages'
        )}
      </Button>
    </div>
  )
}

const EndOfFeedIndicator = ({ position = 'start' }: { position?: 'start' | 'end' }) => {
  return (
    <div
      className={cn(
        'flex h-7 w-full shrink-0 items-center justify-center overflow-hidden',
        position === 'start' ? 'mb-2' : 'mt-2',
      )}
    >
      <div className="absolute right-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      <div className="absolute left-[57.5%] top-1/2 h-px w-[37.5%] bg-grayA-5" />
      {position === 'start' ? (
        <Icons.SunHorizon className="size-6 rounded text-grayA-5" />
      ) : (
        <Icons.Planet className="size-6 rounded text-grayA-5" />
      )}
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
