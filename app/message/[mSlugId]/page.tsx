'use client'

import { useQuery } from 'convex/react'

import { api } from '@/convex/_generated/api'
import { MessagePageView } from '../../components/MessagePageView'

export default function MessagePage({
  params: { mSlugId: slugId },
}: {
  params: { mSlugId: string }
}) {
  const m = useQuery(api.messages.getBySlugIdBeta, { slugId })
  if (!m) return null
  return <MessagePageView {...m} />
}
