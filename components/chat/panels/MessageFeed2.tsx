'use client'

import { useCallback, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { useMessageFeedQuery } from '@/app/lib/api/messages'
import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'

export const MessageFeed2 = ({ threadId }: { threadId: string }) => {
  const [queryStartTime] = useState(Date.now())
  const { results: messages, loadMore, status, isLoading } = useMessageFeedQuery(threadId, 10)

  const nPastMessages = messages.filter((message) => message._creationTime < queryStartTime).length

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      if (atTop) {
        if (status === 'CanLoadMore') {
          console.log('load', 40)
          loadMore(40)
        }
      }
    },
    [loadMore, status],
  )

  return (
    <PanelBody>
      <Virtuoso
        components={{
          EmptyPlaceholder: () => <div className="h-full w-full bg-gray-1"></div>,
        }}
        data={messages}
        alignToBottom
        firstItemIndex={1_000_000 - nPastMessages}
        initialTopMostItemIndex={{
          index: messages.length - 1,
          align: 'end',
          behavior: 'smooth',
        }}
        atTopStateChange={handleAtTopStateChange}
        atTopThreshold={600}
        itemContent={(_, data) => {
          return (
            <div className="mx-auto max-w-[85ch] py-3">
              <Message message={data} />
              {/* <div className="absolute left-1 top-3">{index}</div> */}
            </div>
          )
        }}
        computeItemKey={(_, item) => item._id}
        increaseViewportBy={1200}
        logLevel={1}
      />

      {isLoading && (
        <div className="absolute right-1 top-1 text-right font-mono text-xs text-gray-9">
          <Loader type="ring2" />
        </div>
      )}

      <div className="absolute right-1 top-1 text-right font-mono text-xs text-gray-9">
        {messages.length}
      </div>
    </PanelBody>
  )
}
