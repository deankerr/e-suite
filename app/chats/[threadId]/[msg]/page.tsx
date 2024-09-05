'use client'

import { Message } from '@/components/message/Message'
import { Panel } from '@/components/ui/Panel'
import { useMessage } from '@/lib/api'

export default function Page({ params }: { params: { threadId: string; msg: string } }) {
  const result = useMessage(params.threadId, params.msg)
  return result.message ? (
    <Panel>
      <div className="grow overflow-y-auto p-2 text-sm">
        <Message message={result.message} hideTimeline priority />
      </div>
    </Panel>
  ) : (
    <Panel>{JSON.stringify(result)}</Panel>
  )
}
