import { useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import { useViewerDetails } from '@/lib/queries'

export const Virtualized = () => {
  const { thread, messages, page, removeMessage } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)
  const [firstItemIndex, setFirstItemIndex] = useState(1000)
  const loadMore = () => {
    if (page.status === 'CanLoadMore') {
      console.log('load')
      page.loadMore(25)
      setFirstItemIndex(firstItemIndex - 25)
    }
  }
  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={messages}
      initialTopMostItemIndex={1000 + messages.length}
      firstItemIndex={firstItemIndex}
      startReached={() => {
        console.log('startReached')
        loadMore()
      }}
      itemContent={(index, message) => (
        <Message
          key={message._id}
          timeline={index !== messages.length - 1}
          message={message}
          slug={thread?.slug}
          showMenu={isOwner}
          removeMessage={() => void removeMessage({ messageId: message._id })}
        />
      )}
    />
  )
}
