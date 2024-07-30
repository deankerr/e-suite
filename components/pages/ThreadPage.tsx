'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { IconButton } from '@radix-ui/themes'

import { Composer } from '@/components/composer/Composer'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { MessageFeed } from '@/components/message-feed/MessageFeed'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { PageWrapper } from '@/components/pages/PageWrapper'
import { ThreadProvider, useThreadContext } from '@/components/providers/ThreadProvider'
import { useShellActions } from '@/components/shell/hooks'
import { EmptyPage } from '@/components/shell/pages/EmptyPage'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'

export const ThreadPage = ({
  threadSlug,
  messageSeriesNum,
}: {
  threadSlug?: string
  messageSeriesNum?: string
}) => {
  return (
    <ThreadProvider threadSlug={threadSlug} messageSeriesNum={messageSeriesNum}>
      <PageWrapper>
        <div className="flex h-full flex-col">
          <ThreadPageHeader />
          <ThreadPageBody />
          <ThreadComposer />
          <ThreadPageDebug />
        </div>
      </PageWrapper>
    </ThreadProvider>
  )
}

const ThreadPageHeader = () => {
  const { threadTitle } = useThreadContext()

  return (
    <header className="flex-between h-12 shrink-0 border-b border-grayA-3">
      <div className="flex-start min-w-10 gap-1">
        <SidebarButton className="m-0" />
      </div>
      {threadTitle}

      <div className="flex-start min-w-10 gap-1">
        <IconButton variant="ghost">
          <Icons.X className="size-5" />
        </IconButton>
      </div>
    </header>
  )
}

const ThreadPageBody = () => {
  return <MessageFeed />
}

const ThreadComposer = () => {
  const { thread } = useThreadContext()
  const shell = useShellActions()

  if (!thread) return null

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
  const { thread, messages } = useThreadContext()

  return (
    <AdminOnlyUi>
      {showJson && (
        <Pre stringify={thread} className="absolute inset-x-4 inset-y-16 overflow-auto" />
      )}
      <div className="absolute left-1 top-12 font-mono text-xs text-gray-9">
        <button onClick={() => setShowJson(!showJson)}>{messages?.length ?? '?'}</button>
      </div>
    </AdminOnlyUi>
  )
}
