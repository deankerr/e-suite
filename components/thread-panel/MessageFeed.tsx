import { useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'

import { Message } from '@/components/message/Message'
import { useMessagesQuery } from '@/components/providers/MessagesQueryProvider'
import { api } from '@/convex/_generated/api'
import { useCacheQuery } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { VirtuosoHandle } from 'react-virtuoso'

export const MessageFeed = () => {
  const path = useSuitePath()
  // const { thread } = useThreads(path.slug)
  const latest = useCacheQuery(api.db.threads.latestMessages, {
    slugOrId: path.slug,
    limit: 25,
  })
  const { messages = [] } = useMessagesQuery()
  const feedItems = latest ? latest.concat(messages.slice(8)).toReversed() : undefined
  const virtuoso = useRef<VirtuosoHandle>(null)

  if (!latest) return null

  return (
    <Virtuoso
      ref={virtuoso}
      className="h-full text-sm"
      alignToBottom
      followOutput="smooth"
      data={feedItems}
      initialTopMostItemIndex={latest.length - 1}
      itemContent={(index, message) => {
        return <Message message={message} deepLinkUrl={`${path.threadPath}/${message.series}`} />
      }}
    />
  )
}
