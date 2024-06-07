'use client'

import { Chat } from '@/components/chat/Chat'
import { useThread } from '@/lib/api2'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const thread = useThread(slug)

  return (
    <div className="w-full px-3 sm:py-3">
      <Chat thread={thread.data} />
    </div>
  )
}
