import { ChatPanelTab } from '@/components/chat/chat-panel-tab'
import { initialChatsConfig } from '@/components/chat/config'
import { getChatModels } from '@/lib/api'

type Props = {}

export default function ChatPage(props: Props) {
  const modelsAvailable = getChatModels()

  const tab = initialChatsConfig[1]!

  return (
    <>
      <div className="h-12 bg-muted">
        <div className="flex h-full w-40 items-center justify-center border-t-2 border-primary bg-background text-sm font-medium">
          {tab.panel.title}
        </div>
      </div>
      <ChatPanelTab session={tab} modelsAvailable={modelsAvailable} />
    </>
  )
}

async function dummyUpdateSession() {
  'use server'
}
