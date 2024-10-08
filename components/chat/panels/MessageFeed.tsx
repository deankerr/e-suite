'use client'

import { useMessageFeedQuery, useStreamingMessages } from '@/app/lib/api/threads'
import { VirtualizedFeed } from '@/components/feed/VirtualizedFeed'
import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { appConfig } from '@/config/config'

export const MessageFeed = ({ threadId }: { threadId: string }) => {
  const { results, loadMore, status } = useMessageFeedQuery(threadId)

  const streamingMessages = useStreamingMessages(threadId) ?? []

  const messages = [
    ...results,
    ...streamingMessages.filter(
      (streamingMessage) => !results.findLast((result) => result.runId === streamingMessage.runId),
    ),
  ]

  if (status === 'LoadingFirstPage' && threadId !== 'new')
    return (
      <PanelBody>
        <div className="flex-col-center h-full">
          <Loader type="zoomies" />
        </div>
      </PanelBody>
    )
  if (!messages || messages.length === 0) return null

  return (
    <PanelBody>
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
    </PanelBody>
  )
}
