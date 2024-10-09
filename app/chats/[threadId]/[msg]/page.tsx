'use client'

import { useMessage } from '@/app/lib/api/threads'
import { MessageV1 } from '@/components/message/MessageV1'
import { Panel, PanelEmpty, PanelLoading } from '@/components/ui/Panel'

export default function Page({ params }: { params: { threadId: string; msg: string } }) {
  const result = useMessage(params.threadId, params.msg)

  if (!result) return result === null ? <PanelEmpty /> : <PanelLoading />

  return result.message ? (
    <Panel>
      <div className="grow overflow-y-auto p-2 text-sm">
        <MessageV1 message={result.message} hideTimeline />
      </div>
    </Panel>
  ) : (
    <PanelEmpty />
  )
}
