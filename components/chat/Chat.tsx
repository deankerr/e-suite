'use client'

import { usePathname } from 'next/navigation'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { Toolbar } from '@/components/chat/Toolbar'
import { Composer } from '@/components/composer/Composer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { useThread, useThreadActions } from '@/lib/api'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)
  const pathname = usePathname()

  const actions = useThreadActions(threadId)

  if (!thread)
    return (
      <Panel>
        <PanelHeader />
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
      </PanelHeader>

      <Toolbar threadId={threadId} />
      {children}

      {thread.userIsViewer && (
        <Composer
          onSend={actions.send}
          loading={actions.state !== 'ready'}
          initialResourceKey={thread.latestRunConfig?.resourceKey}
        />
      )}
    </Panel>
  )
}
