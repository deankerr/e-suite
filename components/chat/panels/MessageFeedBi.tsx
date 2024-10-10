'use client'

import { useCallback, useState } from 'react'
import { usePaginatedQuery, useQuery } from 'convex/react'
import { ms } from 'itty-time'
import { Virtuoso } from 'react-virtuoso'

import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { api } from '@/convex/_generated/api'

const useChatFeed = (threadId: string) => {
  const [queryStartTime] = useState(Date.now() - ms('1 hour'))

  const before = usePaginatedQuery(
    api.db.thread.messages.search,
    { threadId, createdBefore: queryStartTime },
    {
      initialNumItems: 6,
    },
  )

  // const after = useQuery(api.db.thread.messages.since, { threadId, createdAfter: queryStartTime })
  console.log('len', before.results.length)
  return {
    before,
    after: { results: [] },
    queryStartTime,
  }
}

export const MessageFeedBi = ({ threadId }: { threadId: string }) => {
  // const { results: messages, loadMore, status } = useMessageFeedQuery(threadId)
  const feed = useChatFeed(threadId)

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      console.log('atTop:', atTop)
      if (atTop) {
        if (feed.before.status === 'CanLoadMore') {
          console.log('load', 6)
          feed.before.loadMore(6)
        }
      }
    },
    [feed.before],
  )

  // if (feed.before.status === 'LoadingFirstPage' && threadId !== 'new')
  //   return (
  //     <PanelBody>
  //       <div className="flex-col-center h-full">
  //         <Loader type="zoomies" />
  //       </div>
  //     </PanelBody>
  //   )

  const messages = feed.before.results.concat(feed.after.results)

  // if (!messages || messages.length === 0) return null
  console.log('f', 1_000_000 - feed.before.results.length)
  return (
    <PanelBody>
      <Virtuoso
        context={{ timeInit: feed.queryStartTime }}
        components={{
          EmptyPlaceholder: () => <div className="h-full w-full bg-green-4"></div>,
        }}
        data={messages}
        alignToBottom
        firstItemIndex={1_000_000 - feed.before.results.length}
        initialTopMostItemIndex={{
          index: messages.length - 1,
          align: 'start',
        }}
        atTopStateChange={handleAtTopStateChange}
        itemContent={(index, data) => {
          return (
            <div className="mx-auto max-w-[85ch] border py-3">
              <Message message={data} />
              <div className="absolute left-1 top-3">{index}</div>
            </div>
          )
        }}
        computeItemKey={(_, item) => item._id}
        increaseViewportBy={900}
        logLevel={0}
      />
    </PanelBody>
  )
}
