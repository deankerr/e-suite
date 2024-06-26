'use client'

import { Chat } from '@/components/chat/Chat'

export const dynamic = 'force-dynamic'

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
  if (slug === 'none') return null

  return (
    <div className="h-full w-full p-2 pt-0 sm:pl-0 sm:pt-2">
      <Chat slug={slug} />
    </div>
  )
}
