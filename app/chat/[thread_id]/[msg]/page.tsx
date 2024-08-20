'use client'

import { Message } from '@/components/message/Message'
import { useMessage } from '@/lib/api'

export default function Page({ params }: { params: { thread_id: string; msg: string } }) {
  const { message } = useMessage(params.thread_id, params.msg)
  return message ? (
    <div className="grow overflow-y-auto p-2 text-sm">
      <Message message={message} hideTimeline priority />
    </div>
  ) : null
}
