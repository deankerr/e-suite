import { useEffect, useRef, useState } from 'react'
import { Code } from '@phosphor-icons/react/dist/ssr'
import { Button, IconButton } from '@radix-ui/themes'

import { useChat } from '@/components/chat/ChatProvider'
import { Message } from '@/components/message/Message'
import InfiniteScroll from '@/components/ui/InfiniteScroll'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ScrollContainer } from '@/components/ui/ScrollContainer'
import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { Pre } from '@/components/util/Pre'
import { useViewerDetails } from '@/lib/queries'

const config = {
  initialHistoryMessages: 25,
}

export const ChatFeed = () => {
  const { thread, messages, page, removeMessage } = useChat()
  const { isOwner } = useViewerDetails(thread?.userId)

  const latestMessageRef = useRef<HTMLDivElement>(null)
  const [initialScroll, setInitialScroll] = useState(false)

  useEffect(() => {
    if (initialScroll || latestMessageRef.current === null) return
    setInitialScroll(true)
    latestMessageRef.current.scrollIntoView({ behavior: 'instant' })
  }, [initialScroll, messages])

  const [showJson, setShowJson] = useState(false)

  const [canLoadMore, setCanLoadMore] = useState(true)

  if (messages === null) return <div>Error</div>
  return (
    <ScrollContainer className="flex flex-col px-2">
      <NonSecureAdminRoleOnly>
        <div className="pointer-events-none fixed top-6 z-20 w-full py-1">
          <IconButton
            variant="ghost"
            color="ruby"
            className="pointer-events-auto"
            onClick={() => setShowJson(!showJson)}
          >
            <Code className="size-5" />
            {messages?.length}
          </IconButton>
        </div>
      </NonSecureAdminRoleOnly>

      {messages === undefined && <LoadingSpinner className="m-auto" />}

      {messages && messages.length >= config.initialHistoryMessages && initialScroll && (
        <InfiniteScroll
          hasMore={page.status !== 'Exhausted' && canLoadMore}
          isLoading={page.isLoading}
          next={() => {
            console.log('load more', page.isLoading, page.status)
            page.loadMore(25)
            setCanLoadMore(false)
          }}
        >
          <Button onClick={() => page.loadMore(25)}>{page.status}</Button>
        </InfiniteScroll>
      )}

      {messages?.map((message, i) => (
        <div key={message._id} ref={latestMessageRef}>
          <Message
            timeline={i !== messages.length - 1}
            message={message}
            slug={thread?.slug}
            showMenu={isOwner}
            removeMessage={() => void removeMessage({ messageId: message._id })}
          />
        </div>
      ))}
      {showJson && (
        <Pre className="fixed inset-0 mb-24 mt-10 bg-panel-solid">
          thread
          {JSON.stringify(thread, null, 2)}
          messages
          {JSON.stringify(messages, null, 2)}
        </Pre>
      )}
    </ScrollContainer>
  )
}

/* {chatCompletion && user && ( <Message className="rounded bg-gold-4 px-2"
        message={getMessageShape({ _id: '_instructions' as Id<'messages'>, _creationTime: 0, series:
        0, threadId: thread?._id as Id<'threads'>, role: 'system', name: 'Instructions', content:
        thread?.instructions, userId: user.data?._id as Id<'users'>,
          })}
        />
      )} */
