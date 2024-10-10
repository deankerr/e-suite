'use client'

import { useMessage } from '@/app/lib/api/messages'
import { Message } from '@/components/message/Message'
import { Panel, PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { VScrollArea } from '@/components/ui/VScrollArea'

export default function Page({ params }: { params: { threadId: string; msg: string } }) {
  const result = useMessage(params.threadId, params.msg)

  if (!result.message) return result.message === null ? <PanelEmpty /> : <PanelLoading />

  return (
    <Panel>
      <VScrollArea>
        <div className="mx-auto max-w-[85ch] py-3">
          <Message message={result.message} />
        </div>
      </VScrollArea>
    </Panel>
  )
}
