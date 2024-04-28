'use client'

import { MessagePageView } from '@/components/pages/MessagePageView'
import { useMessageQuery } from '@/lib/queries'

export default function MessagePage({ params: { mrid: rid } }: { params: { mrid: string } }) {
  const result = useMessageQuery({ rid })
  if (!result) return null
  return <MessagePageView content={result} />
}
