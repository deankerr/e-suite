'use client'

import { useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { useMessageFeedQuery } from '@/app/lib/api/threads'
import { Message } from '@/components/message/Message'
import { LineZoom } from '@/components/ui/Ldrs'
import { appConfig } from '@/config/config'

import type { VirtuosoHandle } from 'react-virtuoso'

export const MessageFeed = ({ threadId }: { threadId: string }) => {
  const { results: messages, loadMore, status } = useMessageFeedQuery(threadId)

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
        return <Message message={message} />
      }}
    />
  )
}
