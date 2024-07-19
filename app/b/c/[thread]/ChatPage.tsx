'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

import { PageWrapper } from '@/app/b/_components/PageWrapper'
import { Composer } from '@/app/b/c/[thread]/_components/composer/Composer'
import { Message } from '@/app/b/c/[thread]/_components/Message'
import { ChatProvider, useChat } from '@/app/b/c/[thread]/_provider/ChatProvider'
import { appConfig } from '@/app/b/config'
import { CommandShell } from '@/components/command-shell/CommandShell'
import { Link } from '@/components/ui/Link'
import { cn } from '@/lib/utils'

const Component = () => {
  const { thread, messages, removeMessage } = useChat()

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <PageWrapper loading />

  return (
    <PageWrapper className="flex flex-col">
      {/* * header * */}
      <header className="flex-between h-12 shrink-0 border border-grayA-3">
        <div className="flex w-11 shrink-0 items-center px-1">
          {/* * command menu button * */}
          <CommandShell>
            <IconButton variant="ghost" className="m-0 transition-none md:-translate-x-14">
              <Icons.List className="size-8" />
            </IconButton>
          </CommandShell>
        </div>

        <div className="flex-center px-1 text-sm font-medium">
          {thread.title ?? 'untitled thread'}
        </div>

        <div className="flex-end w-11 shrink-0 gap-1 px-1">
          <Button variant="outline" size="2" color="gray">
            <Icons.FunnelSimple className="size-5" />
            Filter
          </Button>

          <IconButton variant="ghost" color="gray" className="m-0" disabled>
            <Icons.Sidebar className="size-7" mirrored />
          </IconButton>
        </div>
      </header>

      <ScrollArea scrollbars="vertical">
        {/* * feed * */}
        <div className="mx-auto flex flex-col-reverse items-center gap-0.5 overflow-hidden px-1.5 text-sm">
          <EndOfFeedIndicator />

          {/* * messages * */}
          {messages.map((message) => (
            <Message key={message._id} message={message} removeMessage={removeMessage} />
          ))}

          <LoadMoreButton />
        </div>
      </ScrollArea>
      <Composer className="border-t border-grayA-3 bg-gray-2" />

      <div className="absolute left-0.5 top-11 bg-grayA-3 font-mono text-xs">{messages.length}</div>

      {/* * sidebar * */}
      {/* <Sidebar thread={thread} /> */}
    </PageWrapper>
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
        color="gray"
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

const ChatPageError = () => {
  const router = useRouter()
  return (
    <PageWrapper className="flex flex-col">
      <div className="m-auto flex flex-col items-center px-5">
        <Icons.Cat weight="thin" className="size-60 shrink-0 text-accentA-11" />

        <div
          className="p-3 text-center text-2xl"
          style={{ fontFamily: 'var(--font-chakra-petch)' }}
        >
          There doesn&apos;t appear to be anything at this address.
        </div>

        <div className="flex gap-4 p-2">
          <Link underline="always" color="brown" href="#" onClick={() => router.back()}>
            Go Back
          </Link>

          <Link underline="always" color="brown" href={appConfig.baseUrl}>
            Go Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
