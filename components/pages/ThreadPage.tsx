'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { Composer } from '@/components/composer/Composer'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { MessageFeed } from '@/components/message-feed/MessageFeed'
import { FilterControl } from '@/components/pages/FilterControl'
import { ThreadPanel } from '@/components/pages/ThreadPanel'
import { useShellActions } from '@/components/shell/hooks'
import { TextEditorDialog } from '@/components/text-document-editor/TextEditorDialog'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { useThreads } from '@/lib/api'
import { cn } from '@/lib/utils'

export const ThreadPage = ({ slug }: { slug: string; mNum?: number }) => {
  return (
    <ThreadPanel>
      <div className="flex h-full flex-col">
        <ThreadPageHeader slug={slug} />
        <MessageFeed slug={slug} />
        <ThreadComposer slug={slug} />

        <ThreadPageDebug slug={slug} />
      </div>
    </ThreadPanel>
  )
}

const ThreadPageHeader = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)
  const threadTitle = thread?.title ?? 'Untitled'
  const shell = useShellActions()
  if (!thread) return null

  return (
    <header className="flex-between h-12 shrink-0 gap-2 overflow-hidden border-b border-grayA-3 px-2.5">
      <div className="flex-start min-w-24 shrink-0 gap-1">
        <SidebarButton className="m-0 md:hidden" />
        <TextEditorDialog slug={slug}>
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

      <div className="flex-end min-w-24 shrink-0 gap-1">
        <FilterControl />
      </div>
    </header>
  )
}

const ThreadComposer = ({ slug }: { slug: string }) => {
  const { thread } = useThreads(slug)
  const shell = useShellActions()

  if (!thread || !thread.user?.isViewer) return null

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

const ThreadPageDebug = ({ slug }: { slug: string }) => {
  const [showJson, setShowJson] = useState(false)
  const { thread } = useThreads(slug)

  return (
    <AdminOnlyUi>
      {showJson && (
        <Pre stringify={thread} className="absolute inset-x-4 inset-y-16 overflow-auto" />
      )}
      <div className="absolute left-1 top-12 font-mono text-xs text-gray-9">
        <button onClick={() => setShowJson(!showJson)}>T</button>
      </div>
    </AdminOnlyUi>
  )
}
