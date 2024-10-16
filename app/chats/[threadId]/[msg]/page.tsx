'use client';
import { use } from "react";

import { useMessage } from '@/app/lib/api/messages'
import { Message } from '@/components/message/Message'
import { Panel, PanelEmpty, PanelLoading } from '@/components/ui/Panel'
import { ScrollArea } from '@/components/ui/ScrollArea'

export default function Page(props: { params: Promise<{ threadId: string; msg: string }> }) {
  const params = use(props.params);
  const result = useMessage(params.threadId, params.msg)

  if (!result.message) return result.message === null ? <PanelEmpty /> : <PanelLoading />

  return (
    <Panel>
      <ScrollArea>
        <div className="mx-auto max-w-[85ch] py-3">
          <Message message={result.message} />
        </div>
      </ScrollArea>
    </Panel>
  )
}
