'use client'

import { useRouter } from 'next/navigation'

import { Message } from '@/components/message/Message'
import { SectionPanel } from '@/components/pages/SectionPanel'
import { appConfig } from '@/config/config'
import { useMessage } from '@/lib/api'

import type { EMessage, EThread } from '@/convex/types'

export const MessageDetail = ({ slug, msg }: { slug: string; msg: string }) => {
  const router = useRouter()
  const { thread, message } = useMessage(slug, msg)

  return (
    <SectionPanel
      title="Message Detail"
      onClosePanel={() => router.replace(`${appConfig.threadUrl}/${slug}`)}
      loading={!thread || !message}
    >
      {thread && message && <Body thread={thread} message={message} />}
    </SectionPanel>
  )
}

export const Body = ({ message }: { thread: EThread; message: EMessage }) => {
  return <Message message={message} hideTimeline />
}
