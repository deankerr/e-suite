'use client'

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
import { Loader } from '../ui/Loader'
import { SearchField } from '../ui/SearchField'
import { ChatBackPanel } from './ChatBackPanel'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)

  const runs = useListThreadRuns(threadId)
  const showRunsPanel = false

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
      </PanelHeader>

      {/* > toolbar */}
      <ChatToolbar threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackPanel />

        <PanelBody>
          <MessageFeed threadId={threadId} />
          <div className="flex-start absolute bottom-0 h-16 w-full shrink-0 gap-4 bg-whiteA-9">
            <Loader type="dotWave" />
          </div>
        </PanelBody>

        <MessageSearchResults threadId={threadId} />

        {showRunsPanel && (
          <PanelBody>
            <div className="flex-col-start h-full gap-2 overflow-y-auto overflow-x-hidden bg-transparent p-2">
              {runs?.map((run) => (
                <pre
                  key={run._id}
                  className="w-full whitespace-pre-wrap border bg-gray-1 p-1 font-mono text-xs"
                >
                  {JSON.stringify(run, null, 2)}
                </pre>
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
