'use client'

import { useRef } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { Virtuoso } from 'react-virtuoso'

import { Message } from '@/components/message/Message'
import { LineZoom } from '@/components/ui/Ldrs'
import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'

import type { VirtuosoHandle } from 'react-virtuoso'

export const MessageFeed = ({ threadId }: { threadId: string }) => {
  const { results, loadMore, status } = usePaginatedQuery(
    api.db.threads.listMessages,
    { slugOrId: threadId },
    {
      initialNumItems: appConfig.nInitialMessages,
    },
  )

  const messages = [...results].reverse().sort((a, b) => a.series - b.series)

  const virtuoso = useRef<VirtuosoHandle>(null)

  if (status === 'LoadingFirstPage' && threadId !== 'new')
    return (
      <div className="flex-col-center h-full">
        <LineZoom />
      </div>
    )
  if (!messages || messages.length === 0) return null

  const firstItemIndex = messages[0]?.series ?? 1000000
  return (
    <Virtuoso
      ref={virtuoso}
      className="h-full"
      alignToBottom
      followOutput="smooth"
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      firstItemIndex={firstItemIndex}
      atTopStateChange={(atTop) => {
        if (atTop) loadMore(appConfig.nInitialMessages * 2)
      }}
      computeItemKey={(index, message) => message._id}
      itemContent={(index, message) => {
        return (
          <Message
            message={message}
            // deepLinkUrl={`${path.threadPath}/${message.series}`}
            // isSequential={isSameAuthor(findMessageSeries(message.series - 1), message)}
          />
        )
      }}
    />
  )
}
