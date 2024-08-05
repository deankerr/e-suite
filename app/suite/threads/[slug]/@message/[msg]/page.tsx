'use client'

import { useRouter } from 'next/navigation'

import { Message } from '@/components/message/Message'
import { SectionPanel } from '@/components/pages/SectionPanel'
import { appConfig } from '@/config/config'
import { useMessageInt } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

export default function Page() {
  const router = useRouter()
  const { slug, msg } = useSuitePath()
  const mNum = parseInt(msg ?? '')
  const { thread, message } = useMessageInt(slug, mNum)
  if (!(slug && msg)) return null

  return (
    <SectionPanel
      title="Message Detail"
      onClosePanel={() => router.replace(`${appConfig.threadUrl}/${slug}`)}
    >
      {message && <Message message={message} hideTimeline />}
    </SectionPanel>
  )
}
