import { useEffect, useRef, useState } from 'react'
import { Code } from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'
import { Virtuoso } from 'react-virtuoso'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ScrollContainer } from '@/components/ui/ScrollContainer'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { Pre } from '@/components/util/Pre'
import { useViewerDetails } from '@/lib/queries'

export const MessageFeed = () => {
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
    <div className="h-full">
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
            idx={index}
            message={message}
            slug={thread?.slug}
            showMenu={isOwner}
            removeMessage={() => void removeMessage({ messageId: message._id })}
          />
        )}
      />
    </div>
  )
}
