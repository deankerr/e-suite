'use client'

import { useState } from 'react'

import { useThread } from '@/app/lib/api/threads'
import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { MessageFeed } from '@/components/chat/MessageFeed'
import { MessageSearchResults } from '@/components/chat/MessageSearchResults'
import { Toolbar } from '@/components/chat/Toolbar'
import { Composer } from '@/components/composer/Composer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Panel, PanelBody, PanelBodyGrid, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { IconButton } from '../ui/Button'
import { ChatBackPanel } from './ChatBackPanel'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)

  const [uiState, setUiState] = useState({ feed: true, search: true })

  if (!thread)
    return (
      <Panel>
        <PanelHeader>{thread === null ? 'Thread not found' : <SkeletonShimmer />}</PanelHeader>
      </Panel>
    )

  return (
    <Panel {...props}>
      <PanelHeader>
        <NavigationButton />
        <PanelTitle href={`/chats/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
        <ChatMenu threadId={thread.slug} />
        <FavouriteButton threadId={thread.slug} />
        <div className="grow" />
        <div className="flex-end gap-1">
          <IconButton
            aria-label="feed"
            variant="surface"
            color={uiState.feed ? 'red' : 'gray'}
            onClick={() => setUiState((prev) => ({ ...prev, feed: !prev.feed }))}
          >
            F
          </IconButton>
          <IconButton
            aria-label="search"
            variant="surface"
            color={uiState.search ? 'pink' : 'gray'}
            onClick={(e) => {
              setUiState((prev) => ({ ...prev, search: !prev.search }))
            }}
          >
            S
          </IconButton>
        </div>
      </PanelHeader>

      {/* > toolbar */}
      <Toolbar threadId={threadId} />

      {/* > body */}
      <PanelBodyGrid>
        <ChatBackPanel />

        {uiState.feed && (
          <PanelBody>
            <MessageFeed threadId={threadId} />
          </PanelBody>
        )}

        {uiState.search && <MessageSearchResults threadId={threadId} />}
      </PanelBodyGrid>

      {/* > composer */}
      {thread.user.isViewer && <Composer threadId={threadId} />}
    </Panel>
  )
}
