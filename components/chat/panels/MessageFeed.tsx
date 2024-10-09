'use client'

import { useMessageFeedQuery } from '@/app/lib/api/threads'
import { VirtualizedFeed } from '@/components/feed/VirtualizedFeed'
import { Message } from '@/components/message/Message'
import { MessageV1 } from '@/components/message/MessageV1'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'
import { appConfig } from '@/config/config'

export const MessageFeed = ({ threadId }: { threadId: string }) => {
  const { results: messages, loadMore, status } = useMessageFeedQuery(threadId)

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
    <PanelBody className="">
      <VScrollArea>
        <div className="mx-auto flex max-w-[85ch] flex-col items-stretch gap-4 p-6">
          {messages.map((message) => (
            <Message key={message._id} messageId={message._id} />
          ))}
        </div>
      </VScrollArea>
      {/* <VirtualizedFeed
        items={messages}
        renderItem={(message) => <MessageV1 message={message} />}
        onAtTop={() => {
          if (status === 'CanLoadMore') {
            loadMore(appConfig.nInitialMessages * 2)
            console.log('load', appConfig.nInitialMessages * 2)
          }
        }}
      /> */}
    </PanelBody>
  )
}
