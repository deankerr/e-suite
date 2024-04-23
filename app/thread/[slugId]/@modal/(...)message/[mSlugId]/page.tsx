'use client'

import { useQuery } from 'convex/react'

import { MessagePageView } from '@/app/components/MessagePageView'
import { ModalPageView } from '@/app/components/ModalPageView'
import { api } from '@/convex/_generated/api'

export default function MessageViewModalPage({
  params: { mSlugId: slugId },
}: {
  params: { mSlugId: string }
}) {
  const m = useQuery(api.messages.getBySlugIdBeta, { slugId })

  return <ModalPageView>{m ? <MessagePageView {...m} /> : 'none'}</ModalPageView>
}
