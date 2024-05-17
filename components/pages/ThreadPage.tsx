'use client'

import { MessageCard, MessageCardSkeleton } from '@/components/cards/MessageCard'
import { ImageCard } from '@/components/images/ImageCard'
import { MessageRowVirtualizer } from '@/components/MessageRowVirtualizer'
import { usePageMessages, useRecentMessages, useThread } from '@/lib/api'

import type { ThreadKeys } from '@/lib/types'

export const ThreadPage = ({ keys }: { keys?: ThreadKeys }) => {
  const { thread, message, file } = useThread(keys)

  const slug = keys?.[0]
  const queryKey = slug ? { slug } : 'skip'
  const rmessages = useRecentMessages(queryKey)
  const pmessages = usePageMessages(queryKey)
  return (
    <>
      {/* {isLoading && <ThreadPageSkeleton />} */}
      {file ? (
        <div className="grid h-full place-content-center px-1 py-4 md:px-4">
          <ImageCard image={file} />
        </div>
      ) : message ? (
        <div className="py-2">
          <MessageCard message={message} />
        </div>
      ) : (
        <div className="mx-auto grid grid-cols-2 gap-4 px-1 pb-52 md:px-4">
          {rmessages && <MessageRowVirtualizer messages={rmessages} />}
          {pmessages && <MessageRowVirtualizer messages={pmessages.results} />}
          {/* {thread?.messages && <MessageRowVirtualizer messages={thread.messages} />} */}
        </div>
      )}

      <div className="absolute left-0 top-0 bg-overlay font-mono text-xs text-gray-11">
        {/* keys:{JSON.stringify(keys)} t:{thread?.messages?.length} m:{messages?.length} */}
      </div>
    </>
  )
}

export const ThreadPageSkeleton = () => {
  return (
    <>
      <div className="absolute inset-0 grid w-full animate-pulse grid-rows-4 gap-4 p-1 md:p-4">
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-1"></div>
    </>
  )
}
