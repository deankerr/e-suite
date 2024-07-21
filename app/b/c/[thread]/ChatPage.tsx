'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

import { PageWrapper } from '@/app/b/_components/PageWrapper'
import { useAppendMessage } from '@/app/b/api'
import { Message } from '@/app/b/c/[thread]/_components/Message'
import { ChatProvider, useChat } from '@/app/b/c/[thread]/_provider/ChatProvider'
import { appConfig } from '@/app/b/config'
import { CommandShell } from '@/components/command-shell/CommandShell'
import { Composer } from '@/components/composer/Composer'
import { Link } from '@/components/ui/Link'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

const Component = () => {
  const { thread, messages, removeMessage } = useChat()
  const { appendMessage, inputReadyState } = useAppendMessage(thread?._id)

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <PageWrapper loading />

  return (
    <PageWrapper className="flex flex-col">
      {/* * header * */}
      <header className="flex-between h-12 shrink-0 gap-1 border-b border-grayA-3 px-2">
        <div className="flex w-20 items-center">
          {/* * command menu button * */}
          <CommandShell>
            <IconButton variant="ghost" className="m-0 shrink-0 transition-none md:-translate-x-14">
              <Icons.List className="phosphor" />
            </IconButton>
          </CommandShell>
        </div>

        <div className="truncate px-1 text-sm font-medium md:absolute md:left-1/2 md:max-w-[70%] md:-translate-x-1/2 md:transform md:whitespace-nowrap">
          {thread.title ?? 'untitled thread'}
        </div>

        <div className="flex shrink-0 items-center">
          <Button variant="outline" color="gray">
            Filter
            <Icons.FunnelSimple className="phosphor" />
          </Button>
        </div>
      </header>

      {/* * feed * */}
      <ScrollArea scrollbars="vertical">
        <div className="mx-auto flex flex-col-reverse items-center overflow-hidden px-1.5 text-sm">
          {/* <EndOfFeedIndicator /> */}

          {/* * messages * */}
          {messages.map((message, i) => (
            <Message
              key={message._id}
              message={message}
              removeMessage={removeMessage}
              showNameAvatar={!isSameAuthor(message, messages.at(i + 1))}
            />
          ))}

          <LoadMoreButton />
        </div>
      </ScrollArea>

      {/* * composer * */}
      <Composer
        runConfig={thread.inference}
        model={thread.model}
        appendMessage={appendMessage}
        inputReadyState={inputReadyState}
        textareaMinRows={1}
        className="border-t border-grayA-3 pt-1"
      />

      <div className="pointer-events-none absolute left-1 top-12 scale-90 font-mono text-xs text-gray-9">
        {messages.length}
      </div>
    </PageWrapper>
  )
}

const isSameAuthor = (message: EMessage, previousMessage?: EMessage) => {
  if (previousMessage === undefined) return false
  return message.name === previousMessage.name && message.role === previousMessage.role
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
