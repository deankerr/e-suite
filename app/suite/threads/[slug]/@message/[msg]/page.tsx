'use client'

import { MessageDetail } from '@/components/pages/MessageDetail'
import { useSuitePath } from '@/lib/helpers'

export default function Page() {
  const { slug, msg } = useSuitePath()
  if (!(slug && msg)) return null

  return <MessageDetail slug={slug} msg={msg} />
}
