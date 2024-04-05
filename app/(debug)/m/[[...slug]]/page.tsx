'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MessageSingle } from './MessageSingle'

export default function MessagePage({ params }: { params: { slug?: [Id<'messages'>] } }) {
  const messageId = params.slug ? params.slug[0] : undefined
  const queryKey = messageId ? { messageId } : 'skip'
  const message = useQuery(api.messages.get, queryKey)

  return message ? <MessageSingle message={message} /> : 'loadin'
}
