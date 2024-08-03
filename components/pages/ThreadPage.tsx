'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton, ScrollArea } from '@radix-ui/themes'
import Link from 'next/link'

import { Composer } from '@/components/composer/Composer'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { MessageFeed } from '@/components/message-feed/MessageFeed'
import { Message } from '@/components/message/Message'
import { FilterControl } from '@/components/pages/FilterControl'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { ThreadProvider, useThreadContext } from '@/components/providers/ThreadProvider'
import { useShellActions } from '@/components/shell/hooks'
import { EmptyPage } from '@/components/shell/pages/EmptyPage'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'

export const ThreadPage = ({
  threadSlug,
  messageSeriesNum,
}: {
  threadSlug?: string
  messageSeriesNum?: string
}) => {
  return (
    <ThreadProvider threadSlug={threadSlug} messageSeriesNum={messageSeriesNum}>
      <ThreadPageWrapper>
        <div className="flex h-full flex-col">
          <ThreadPageHeader />
          <ThreadPageBody />
          <ThreadComposer />

          <ThreadPageDebug />
        </div>
      </ThreadPageWrapper>
    </ThreadProvider>
  )
}

const ThreadPageHeader = () => {
  const { thread, threadTitle, isSeriesMessage } = useThreadContext()
  const shell = useShellActions()
  if (!thread) return null

  return (
    <header className="flex-between h-12 shrink-0 gap-2 overflow-hidden border-b border-grayA-3 px-2.5">
      <div className="flex-start min-w-10 shrink-0 gap-1">
        <SidebarButton className="m-0 md:hidden" />
        <TextEditorDialog>
          <IconButton variant="soft" color="gray">
            <Icons.Code className="size-4" />
          </IconButton>
        </TextEditorDialog>
      </div>

      <div className="flex overflow-hidden">
        <Button
          variant="soft"
          color="gray"
          highContrast
          className={cn(
            'max-w-full',
            !thread.user?.isViewer && 'pointer-events-none [&>svg]:hidden',
          )}
          onClick={() => shell.open({ threadId: thread._id })}
        >
          <div className="truncate">{threadTitle}</div>
          <Icons.CaretUpDown className="shrink-0" />
        </Button>
      </div>

      <div className="flex-end min-w-10 shrink-0 gap-1">
        {isSeriesMessage ? (
          <Link href={`${appConfig.chatUrl}/${thread.slug}`}>
            <IconButton variant="ghost" className="m-0">
              <Icons.X className="size-5" />
            </IconButton>
          </Link>
        ) : (
          <FilterControl />
        )}
      </div>
    </header>
  )
}

const ThreadPageBody = () => {
  const { isSeriesMessage } = useThreadContext()
  return isSeriesMessage ? <SingleMessagePage /> : <MessageFeed />
}

const SingleMessagePage = () => {
  const { seriesMessage } = useThreadContext()

  if (seriesMessage === null) return <EmptyPage />
  if (!seriesMessage) return <LoadingSpinner />

  return (
    <div className="overflow-hidden">
      <ScrollArea scrollbars="vertical">
        <div className="mx-auto flex flex-col-reverse items-center overflow-hidden px-3 text-sm">
          <Message message={seriesMessage} showTimeline={false} priority={true} />
        </div>
      </ScrollArea>
    </div>
  )
}

const ThreadComposer = () => {
  const { thread, isSeriesMessage } = useThreadContext()
  const shell = useShellActions()

  if (!thread || !thread.user?.isViewer || isSeriesMessage) return null

  return (
    <Composer
      runConfig={thread.inference}
      model={thread.model}
      onModelChange={() => shell.open({ threadId: thread._id })}
      textareaMinRows={1}
      threadId={thread._id}
      className="border-t border-grayA-3 pt-1"
    />
  )
}

const ThreadPageDebug = () => {
  const [showJson, setShowJson] = useState(false)
  const { thread, messages, messagesQuery, status } = useThreadContext()

  return (
    <AdminOnlyUi>
      {showJson && (
        <Pre stringify={thread} className="absolute inset-x-4 inset-y-16 overflow-auto" />
      )}
      <div className="absolute left-1 top-12 font-mono text-xs text-gray-9">
        <button onClick={() => setShowJson(!showJson)}>{messages?.length ?? '?'}</button>
        <span>{messagesQuery.byMediaType ?? 'all'}</span>
        <span className="">{status}</span>
      </div>
    </AdminOnlyUi>
  )
}

const ThreadPageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { thread } = useThreadContext()

  return (
    <div className="h-full w-full overflow-x-hidden border-grayA-5 bg-gray-2 md:rounded-md md:border">
      {thread === null ? <EmptyPage /> : thread === undefined ? <LoadingPage /> : children}
    </div>
  )
}
