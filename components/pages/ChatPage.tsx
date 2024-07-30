'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'

import { Composer } from '@/components/composer/Composer'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { MessageFeed } from '@/components/message-feed/MessageFeed'
import { FilterControl } from '@/components/pages/FilterControl'
import { PageWrapper } from '@/components/pages/PageWrapper'
import { useShellActions } from '@/components/shell/hooks'
import { Link } from '@/components/ui/Link'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { Pre } from '@/components/util/Pre'
import { appConfig } from '@/config/config'
import { useViewerDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'

import type { EMessage, EThread } from '@/convex/types'

const ChatPageImpl = () => {
  const { thread, isMessageSeriesQuery, seriesMessage } = {} as unknown as {
    thread: EThread
    isMessageSeriesQuery: boolean
    seriesMessage: EMessage
  }
  const { isOwner } = useViewerDetails(thread?.userId)

  const shell = useShellActions()

  if (thread === null || (isMessageSeriesQuery && seriesMessage === null)) return <ChatPageError />
  if (thread === undefined || (isMessageSeriesQuery && seriesMessage === undefined))
    return <PageWrapper loading />

  const threadTitle = thread.title ?? 'untitled thread'

  return (
    <PageWrapper>
      <div className="flex h-full flex-col">
        {/* * header * */}
        <header className="grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-grayA-3 px-2.5">
          {/* * header left * */}
          <div className="flex-start min-w-10 gap-1">
            <SidebarButton className="m-0 md:hidden" />
          </div>

          {/* * header center * */}
          <div className="overflow-hidden">
            <Button
              variant="soft"
              size={{ initial: '1', sm: '2' }}
              color="gray"
              highContrast
              className={cn('max-w-full', !isOwner && 'pointer-events-none [&>svg]:hidden')}
              onClick={() => isOwner && shell.open({ threadId: thread._id })}
            >
              <div className="truncate">{threadTitle}</div>
              <Icons.CaretUpDown className="shrink-0" />
            </Button>
          </div>

          {/* * header right * */}
          <div className="flex-end min-w-10 gap-1 md:min-w-24">
            <FilterControl buttonProps={{ disabled: isMessageSeriesQuery }} />
          </div>
        </header>

        {/* * feed * */}
        <MessageFeed />

        {/* * composer * */}
        {isOwner && (
          <Composer
            runConfig={thread.inference}
            model={thread.model}
            onModelChange={() => shell.open({ threadId: thread._id })}
            textareaMinRows={1}
            threadId={thread._id}
            className="border-t border-grayA-3 pt-1"
          />
        )}

        {/* <ChatPageDebug /> */}
      </div>
    </PageWrapper>
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

// const ChatPageDebug = () => {
//   const [showJson, setShowJson] = useState(false)
//   const { thread, messages } = useChat()

//   return (
//     <AdminOnlyUi>
//       {showJson && (
//         <Pre stringify={thread} className="absolute inset-x-4 inset-y-16 overflow-auto" />
//       )}
//       <div className="absolute left-1 top-12 font-mono text-xs text-gray-9">
//         <button onClick={() => setShowJson(!showJson)}>{messages?.length ?? '?'}</button>
//       </div>
//     </AdminOnlyUi>
//   )
// }
