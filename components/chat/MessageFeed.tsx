'use client'

import { useMessageFeedQuery } from '@/app/lib/api/threads'
import { Message } from '@/components/message/Message'
import { LineZoom } from '@/components/ui/Ldrs'
import { appConfig } from '@/config/config'
import { VirtualizedFeed } from '../feed/VirtualizedFeed'

export const MessageFeed = ({ threadId }: { threadId: string }) => {
  const { results: messages, loadMore, status } = useMessageFeedQuery(threadId)

  if (status === 'LoadingFirstPage' && threadId !== 'new')
    return (
      <div className="flex-col-center h-full">
        <LineZoom />
      </div>
    )
  if (!messages || messages.length === 0) return null

  return (
    <VirtualizedFeed
      items={messages}
      renderItem={(message) => <Message message={message} />}
      onAtTop={() => {
        if (status === 'CanLoadMore') {
          loadMore(appConfig.nInitialMessages * 2)
          console.log('load', appConfig.nInitialMessages * 2)
        }
      }}
    />
  )
}
