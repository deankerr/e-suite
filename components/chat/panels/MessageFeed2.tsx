'use client'

import { useCallback, useRef, useState } from 'react'
import { Components, Virtuoso, VirtuosoHandle } from 'react-virtuoso'

import { useMessageFeedQuery } from '@/app/lib/api/messages'
import { twx } from '@/app/lib/utils'
import { Message } from '@/components/message/Message'
import { Loader } from '@/components/ui/Loader'
import { PanelBody } from '@/components/ui/Panel'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'

export const MessageFeed2 = ({ threadId }: { threadId: string }) => {
  const [queryStartTime] = useState(Date.now())
  const { results, loadMore, status, isLoading } = useMessageFeedQuery(threadId, 10)

  const nPastMessages = results.filter((message) => message._creationTime < queryStartTime).length

  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const [isAtTop, setIsAtTop] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const handleAtTopStateChange = useCallback(
    (atTop: boolean) => {
      setIsAtTop(atTop)
      if (atTop && status === 'CanLoadMore') {
        console.log('load', 40)
        loadMore(40)
      }
    },
    [loadMore, status],
  )

  const handleAtBottomStateChange = useCallback((atBottom: boolean) => setIsAtBottom(atBottom), [])

  return (
    <PanelBody>
      <Virtuoso
        ref={virtuosoRef}
        context={{ status, isLoading }}
        components={{
          Header,
          List,
          EmptyPlaceholder,
          ScrollSeekPlaceholder,
        }}
        data={results}
        alignToBottom
        followOutput="smooth"
        firstItemIndex={1_000_000 - nPastMessages}
        initialTopMostItemIndex={{
          index: results.length - 1,
          align: 'end',
          behavior: 'smooth',
        }}
        atTopStateChange={handleAtTopStateChange}
        atTopThreshold={1200}
        atBottomStateChange={handleAtBottomStateChange}
        atBottomThreshold={200}
        itemContent={(_, data) => {
          return (
            <div className="mx-auto max-w-4xl py-2">
              <Message message={data} />
            </div>
          )
        }}
        computeItemKey={(_, item) => item._id}
        increaseViewportBy={1200}
        logLevel={1}
      />

      {status === 'LoadingMore' && (
        <div className="absolute right-5 top-1 text-right font-mono text-xs text-gray-9">
          <Loader type="ring2" size={32} />
        </div>
      )}

      <AdminOnlyUi>
        <div className="absolute right-5 top-1 text-right font-mono text-xs text-gray-9">
          {isAtTop ? 'atTop' : ''} {isAtBottom ? 'atBottom' : ''} {nPastMessages} {results.length}
        </div>
      </AdminOnlyUi>
    </PanelBody>
  )
}

const ScrollSeekPlaceholder: Components['ScrollSeekPlaceholder'] = ({ height }) => {
  return (
    <div className="mx-auto max-w-[85ch] py-3" style={{ height }}>
      <div
        className="flex h-full shrink-0 flex-col overflow-hidden rounded border bg-gray-2"
        style={{ contain: 'paint' }}
      >
        <div className="h-12 bg-grayA-2" />
        <div className="grow" />
      </div>
    </div>
  )
}

const EmptyPlaceholder: Components<any, any>['EmptyPlaceholder'] = ({ context }) => (
  <div className="flex-center h-full w-full bg-gray-1">
    {context.status === 'LoadingFirstPage' && <Loader type="zoomies" />}
  </div>
)

const Header: Components<any, any>['Header'] = ({ context }) => {
  return (
    <div className="mx-auto flex max-w-3xl items-center px-1 pb-1.5 pt-3 md:px-6">
      {context.status === 'Exhausted' && (
        <div className="flex-center h-12 w-full rounded-md border text-gray-8">
          <div>This is the start of the chat.</div>
        </div>
      )}
    </div>
  )
}

const Footer: Components<any, any>['Footer'] = ({ context }) => {
  return (
    <div className="mx-auto flex max-w-3xl items-center px-1 pb-3 pt-1.5 md:px-6">
      <div className="flex-center h-12 w-full rounded-md text-gray-8"></div>
    </div>
  )
}

const List = twx.div`px-1 md:px-6`
