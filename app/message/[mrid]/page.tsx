'use client'

import { MessagePage } from '@/components/pages/MessagePage'
import { useMessageQuery } from '@/lib/queries'

export default function Page({ params: { mrid: rid } }: { params: { mrid: string } }) {
  const result = useMessageQuery({ rid })
  if (!result) return null
  return <MessagePage content={result} />
}
