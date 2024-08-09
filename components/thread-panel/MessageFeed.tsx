import { useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { Message } from '@/components/message/Message'
import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { isSameAuthor } from '@/convex/shared/helpers'
import { useSuitePath } from '@/lib/helpers'

import type { VirtuosoHandle } from 'react-virtuoso'

export const MessageFeed = () => {
  const path = useSuitePath()

  const { messages, loadMore } = useMessagesQuery()
  const virtuoso = useRef<VirtuosoHandle>(null)

  if (!messages || messages.length === 0) return null

  return (
    <Virtuoso
      ref={virtuoso}
      className="h-full text-sm"
      alignToBottom
      followOutput="smooth"
      data={messages}
      initialTopMostItemIndex={messages.length - 1}
      firstItemIndex={1000000 - messages.length}
      atTopStateChange={(atTop) => {
        if (atTop) {
          loadMore()
        }
      }}
      computeItemKey={(index, message) => message._id}
      itemContent={(index, message) => {
        return (
          <Message
            message={message}
            deepLinkUrl={`${path.threadPath}/${message.series}`}
            isSequential={isSameAuthor(messages[index - 1000001 + messages.length], message)}
          />
        )
      }}
    />
  )
}
