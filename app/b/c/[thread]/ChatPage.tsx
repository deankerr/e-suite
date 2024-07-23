'use client'

import { useEffect, useRef, useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import { Authenticated } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

import { PageWrapper } from '@/app/b/_components/PageWrapper'
import { useAppendMessage } from '@/app/b/api'
import { FilterControl } from '@/app/b/c/[thread]/_components/FilterControl'
import { Message } from '@/app/b/c/[thread]/_components/Message'
import { ChatProvider, useChat } from '@/app/b/c/[thread]/_provider/ChatProvider'
import { appConfig } from '@/app/b/config'
import { Composer } from '@/components/composer/Composer'
import { UserButtons } from '@/components/layout/UserButtons'
import { useShellActions } from '@/components/shell/hooks'
import { ShellC } from '@/components/shell/Shell'
import { Link } from '@/components/ui/Link'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { useViewerDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

const ChatPageImpl = () => {
  const { thread, messages, removeMessage, page } = useChat()
  const { appendMessage, inputReadyState } = useAppendMessage(thread?._id)
  const { isOwner } = useViewerDetails(thread?.userId)
  const shell = useShellActions()

  const [showJson, setShowJson] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const [endOfFeedRef, endOfFeedInView] = useInView()
  const shouldShowScrollToBottom = messages.length > 0 && !endOfFeedInView

  const getScrollToEndButtonPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      return { top: rect.bottom - 64, left: rect.right - 64 }
    }
    return { top: 0, left: 0 }
  }

  const scrollToEnd = (behavior: 'smooth' | 'instant' = 'smooth') => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      })
    }
  }

  const initialScrollToEnd = useRef(false)
  useEffect(() => {
    if (!initialScrollToEnd.current && page.status !== 'LoadingFirstPage') {
      scrollToEnd('instant')
      initialScrollToEnd.current = true
    }
  }, [page.status])

  if (thread === null) return <ChatPageError />
  if (thread === undefined) return <PageWrapper loading />

  return (
    <PageWrapper className="flex flex-col">
      {/* * header * */}
      <header className="flex-between h-12 shrink-0 gap-1 border-b border-grayA-3 px-2">
        <div className="flex-start shrink-0">
          <ShellC />

          <div className="flex-start shrink-0 md:hidden">
            <UserButtons />
          </div>

          <Authenticated>
            <IconButton variant="ghost" className="m-0 shrink-0" onClick={() => shell.open()}>
              <Icons.TerminalWindow className="phosphor" />
            </IconButton>
          </Authenticated>

          {isOwner && (
            <IconButton
              variant="ghost"
              className="m-0 shrink-0"
              onClick={() => shell.open({ threadId: thread._id })}
            >
              <Icons.Sliders className="phosphor" />
            </IconButton>
          )}
        </div>

        <div className="truncate px-1 text-sm font-medium md:absolute md:left-1/2 md:max-w-[70%] md:-translate-x-1/2 md:transform md:whitespace-nowrap">
          {thread.title ?? 'untitled thread'}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <AdminOnlyUi>
            <IconButton
              variant="ghost"
              className="m-0 shrink-0"
              onClick={() => setShowJson(!showJson)}
            >
              <Icons.Code className="phosphor" />
            </IconButton>
          </AdminOnlyUi>

          <FilterControl />
        </div>
      </header>

      {/* * feed * */}
      <ScrollArea ref={containerRef} scrollbars="vertical">
        <div className="mx-auto flex flex-col-reverse items-center overflow-hidden px-3 text-sm">
          <div ref={endOfFeedRef} className="pointer-events-none h-4 w-full" />

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

      {/* * scroll to bottom * */}
      <IconButton
        variant="soft"
        className={cn(
          'fixed animate-fade animate-delay-100 animate-duration-100',
          !shouldShowScrollToBottom && 'hidden',
        )}
        style={getScrollToEndButtonPosition()}
        onClick={scrollToEnd}
      >
        <Icons.ArrowDown className="phosphor" />
      </IconButton>

      {/* * composer * */}
      {isOwner ? (
        <Composer
          runConfig={thread.inference}
          model={thread.model}
          appendMessage={appendMessage}
          inputReadyState={inputReadyState}
          onModelChange={() => shell.open({ threadId: thread._id })}
          textareaMinRows={1}
          className="border-t border-grayA-3 pt-1"
        />
      ) : null}

      {/* * show json * */}
      {showJson && (
        <div className="absolute inset-14 overflow-hidden rounded border">
          <Pre className="h-full overflow-auto">{JSON.stringify(thread, null, 2)}</Pre>
        </div>
      )}

      <AdminOnlyUi>
        <div className="pointer-events-none absolute left-1 top-12 scale-90 font-mono text-xs text-gray-9">
          {messages.length}
        </div>
      </AdminOnlyUi>
    </PageWrapper>
  )
}

const isSameAuthor = (message: EMessage, previousMessage?: EMessage) => {
  if (previousMessage === undefined) return false
  return message.name && message.name === previousMessage.name
}

export const ChatPage = ({ slug, onClose }: { slug: string; onClose?: (slug: string) => void }) => {
  return (
    <ChatProvider slug={slug} onClose={onClose}>
      <ChatPageImpl />
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
