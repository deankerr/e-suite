import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useQuery } from 'convex-helpers/react/cache/hooks'

import { useThread } from '@/app/lib/api/threads'
import { PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { api } from '@/convex/_generated/api'
import { NavigationButton } from '../navigation/NavigationSheet'
import { IconButton } from '../ui/Button'
import { ChatMenu } from './ChatMenu'
import { ChatSearchField } from './ChatSearchField'
import { FavouriteButton } from './FavouriteButton'

export const ChatHeader = ({ threadId }: { threadId: string }) => {
  const thread = useThread(threadId)
  const [showRunsPanel, setShowRunsPanel] = useState(false)

  const msgs = useQuery(api.db.thread.messages.list, { threadId })

  if (!thread) return null
  return (
    <PanelHeader className="bg-grayA-1">
      <NavigationButton />
      <PanelTitle href={`/chats/${thread.slug}`}>{thread.title ?? 'Untitled Thread'}</PanelTitle>
      <ChatMenu threadId={thread.slug} />
      <FavouriteButton threadId={thread.slug} />
      {msgs?.[0]?.text?.slice(0, 40)}
      <div className="grow" />

      <ChatSearchField />
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
  )
}
