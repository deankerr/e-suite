'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'

import { useListThreadRuns, useThread, useThreadTextSearchQueryParams } from '@/app/lib/api/threads'
import { ChatMenu } from '@/components/chat/ChatMenu'
import { ChatToolbar } from '@/components/chat/ChatToolbar'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { MessageSearchResults } from '@/components/chat/MessageSearchResults'
import { Composer } from '@/components/composer/Composer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import {
  Panel,
  PanelBody,
  PanelBodyGrid,
  PanelEmpty,
  PanelHeader,
  PanelLoading,
  PanelTitle,
} from '@/components/ui/Panel'
import { getErrorMessage, parseJson } from '@/convex/shared/utils'
import { IconButton } from '../ui/Button'
import { RunStatusBadge } from '../ui/RunStatusBadge'
import { SearchField } from '../ui/SearchField'
import { ChatBackPanel } from './ChatBackPanel'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)

  const runs = useListThreadRuns(threadId)
  const [showRunsPanel, setShowRunsPanel] = useState(false)

  if (!thread) return thread === null ? <PanelEmpty /> : <PanelLoading />
  return (
    <Panel {...props}>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href={`/chats/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
        <ChatMenu threadId={thread.slug} />
        <FavouriteButton threadId={thread.slug} />

        <div className="grow" />

        <ThreadQuerySearchField />

        <IconButton
          aria-label="Show runs"
          variant="surface"
          color={showRunsPanel ? 'orange' : 'gray'}
          onClick={() => setShowRunsPanel(!showRunsPanel)}
          className="ml-2"
        >
          <Icons.ListPlus />
        </IconButton>
      </PanelHeader>

      {/* > toolbar */}
      <ChatToolbar threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackPanel />

        <PanelBody>
          <MessageFeed threadId={threadId} />
        </PanelBody>

        <MessageSearchResults threadId={threadId} />

        {showRunsPanel && (
          <PanelBody className="justify-self-end bg-transparent">
            <div className="flex-col-start h-full items-end gap-2 overflow-y-auto overflow-x-hidden bg-blackA-4 p-2">
              {runs?.map((run) => (
                <div
                  key={run._id}
                  className="flex-col-start w-80 gap-2 rounded border bg-gray-1 px-3 py-2 text-xs"
                >
                  <div className="flex-between gap-2">
                    <RunStatusBadge status={run.status} />
                    {run.endedAt && run.startedAt ? (
                      <span>{((run.endedAt - run.startedAt) / 1000).toFixed(2)}s</span>
                    ) : null}
                  </div>

                  {run.errors?.map((err, i) => (
                    <div key={i}>{getErrorMessage(parseJson(err))}</div>
                  ))}

                  <pre className="whitespace-pre-wrap border-t p-1 pt-2 font-mono text-xxs">
                    {JSON.stringify(run, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </PanelBody>
        )}
      </PanelBodyGrid>

      {/* > composer */}
      {thread.user.isViewer && <Composer threadId={threadId} />}
    </Panel>
  )
}

const ThreadQuerySearchField = () => {
  const {
    search: [searchTextValue, setSearchTextValue],
  } = useThreadTextSearchQueryParams()

  return <SearchField value={searchTextValue} onValueChange={setSearchTextValue} className="w-52" />
}
