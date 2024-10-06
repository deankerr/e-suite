'use client'

import { useThread, useThreadTextSearchQueryParams } from '@/app/lib/api/threads'
import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { MessageSearchResults } from '@/components/chat/MessageSearchResults'
import { Toolbar } from '@/components/chat/Toolbar'
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
import { SearchField } from '../ui/SearchField'
import { ChatBackPanel } from './ChatBackPanel'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)
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
      <Toolbar threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackPanel />

        <PanelBody>
          <MessageFeed threadId={threadId} />
        </PanelBody>

        <MessageSearchResults threadId={threadId} />
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
