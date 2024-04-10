'use client'

import { useQuery } from 'convex/react'
import Link from 'next/link'

import { api } from '@/convex/_generated/api'

export default function TSlugPage({ params }: { params: { slug: string } }) {
  const thread = useQuery(api.threads.getBySlug, { slug: params.slug })
  const messages = useQuery(
    api.messages.list,
    thread ? { threadId: thread?._id, limit: 100 } : 'skip',
  )

  const genMsgList = messages?.filter((msg) => msg.inference?.type === 'textToImage')
  return (
    <div className="">
      {genMsgList?.map((msg) => {
        if (msg.inference?.type !== 'textToImage') return null
        return (
          <div key={msg._id}>
            <Link href={`/m/${msg.slug}`}>{msg.inference.title}</Link>
          </div>
        )
      })}
    </div>
  )
}
