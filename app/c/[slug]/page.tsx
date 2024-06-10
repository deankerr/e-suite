'use client'

import { Chat } from '@/components/chat/Chat'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  if (slug === 'none') return null

  return (
    <div className="w-full px-3 sm:py-3">
      <Chat slug={slug} />
    </div>
  )
}
