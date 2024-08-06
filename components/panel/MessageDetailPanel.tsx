'use client'

import { useRouter } from 'next/navigation'

import { SidebarButton } from '@/components/layout/SidebarButton'
import { Message } from '@/components/message/Message'
import { LoadingPage } from '@/components/pages/LoadingPage'
import { Panel } from '@/components/panel/Panel'
import { appConfig } from '@/config/config'
import { getMessageName, getMessageText } from '@/convex/shared/helpers'
import { useMessage } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'

import type { EMessage, EThread } from '@/convex/types'

export const MessageDetailPanel = () => {
  const path = useSuitePath()
  const { thread, message } = useMessage(path.slug, path.msg)

  if (!path.msg) return null
  return (
    <Panel>
      {thread && message ? <Body thread={thread} message={message} /> : <LoadingPage />}
    </Panel>
  )
}

const Body = ({ thread, message }: { thread: EThread; message: EMessage }) => {
  const path = useSuitePath()
  const router = useRouter()

  const name = getMessageName(message)
  const text = getMessageText(message)
  return (
    <>
      <Panel.Header>
        <SidebarButton />
        <Panel.Title>
          {thread.title} ⋅ {name} ⋅ {text}
        </Panel.Title>
        <Panel.CloseButton onClick={() => router.replace(`${appConfig.threadUrl}/${path.slug}`)} />
      </Panel.Header>
      <Panel.Content>
        <div className="p-2">
          <Message message={message} hideTimeline />
        </div>
      </Panel.Content>
    </>
  )
}
