'use client'

import { ChatView } from '@/components/chat/ChatView'
import { useThreadContent } from '@/lib/api'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const thread = useThreadContent(slug)

  return (
    <div className="w-full p-1">
      <ChatView thread={thread} />
    </div>
  )
}
