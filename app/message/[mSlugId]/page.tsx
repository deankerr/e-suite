'use client'

import { useMessageQuery } from '@/app/queries'
import { MessagePageView } from '@/components/pages/MessagePageView'

export default function MessagePage({
  params: { mSlugId: slugId },
}: {
  params: { mSlugId: string }
}) {
  const result = useMessageQuery({ slugId })
  if (!result) return null
  return <MessagePageView {...result} />
}
