'use client'

import { useMessageQuery } from '@/app/queries'
import { MessagePageView } from '@/components/pages/MessagePageView'

export default function MessagePage({ params: { mrid: rid } }: { params: { mrid: string } }) {
  const result = useMessageQuery({ rid })
  if (!result) return null
  return <MessagePageView content={result} />
}
