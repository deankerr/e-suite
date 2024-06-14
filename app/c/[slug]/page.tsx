'use client'

import { ChatStack } from '@/components/chat/ChatStack'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  if (slug === 'none') return null

  return (
    <div className="w-full p-1">
      <ChatStack slug={slug} />
    </div>
  )
}
