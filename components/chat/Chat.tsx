'use client'

import { useMutation } from 'convex/react'

import { useThread } from '@/app/lib/api/threads'
import { ChatMenu } from '@/components/chat/ChatMenu'
import { FavouriteButton } from '@/components/chat/FavouriteButton'
import { Toolbar } from '@/components/chat/Toolbar'
import { Composer } from '@/components/composer/Composer'
import { NavigationButton } from '@/components/navigation/NavigationSheet'
import { Panel, PanelHeader, PanelTitle } from '@/components/ui/Panel'
import { SkeletonShimmer } from '@/components/ui/Skeleton'
import { api } from '@/convex/_generated/api'
import { useThreadActions } from '@/lib/api'

export const Chat = ({
  threadId,
  children,
  ...props
}: { threadId: string } & React.ComponentProps<typeof Panel>) => {
  const thread = useThread(threadId)
  const actions = useThreadActions(thread?._id)

  const sendCreateRun = useMutation(api.db.runs.create)
  const handleRun = (text: string, model: { provider: string; id: string }) => {
    const appendMessages = text ? [{ role: 'user' as const, text }] : undefined

    sendCreateRun({
      threadId: thread?._id ?? '',
      model,
      appendMessages,
    })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.error(error)
      })
  }

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
      </PanelHeader>

      <Toolbar threadId={threadId} />
      {children}

      {thread.user.isViewer && (
        <Composer
          onAppend={actions.append}
          loading={actions.state !== 'ready'}
          onRun={handleRun}
          initialResourceKey={getModelKey(thread.kvMetadata)}
        />
      )}
    </Panel>
  )
}

function getModelKey(kvMetadata: Record<string, string>) {
  const id = kvMetadata['esuite:model:id']
  const provider = kvMetadata['esuite:model:provider']
  if (!id || !provider) return undefined
  return `${provider}::${id}`
}
