'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { MessageGalleryPage } from './MessageGalleryPage'

export default function MPage({ params }: { params: { slug?: [Id<'messages'>] } }) {
  const messageId = params.slug ? params.slug[0] : undefined
  const queryKey = messageId ? { messageId } : 'skip'
  const message = useQuery(api.messages.get, queryKey)

  // return message ? <MessageSingle message={message} /> : 'loadin'
  if (!message) return 'loading'
  const { inference, content } = message
  if (inference?.type === 'textToImage')
    return <MessageGalleryPage inference={inference} content={content} />
  return 'no'
}
