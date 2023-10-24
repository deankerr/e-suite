import { ChatPanelTab } from '@/components/chat/chat-panel-tab'
import { initialChatsConfig } from '@/components/chat/config'
import { getChatModels } from '@/lib/api'
import { DotFilledIcon } from '@radix-ui/react-icons'

type Props = {}

export default function ChatPage(props: Props) {
  const modelsAvailable = getChatModels()

  const tab = initialChatsConfig[1]!

  return (
    <>
      <div className="h-10 flex-none bg-muted">
        <div className="flex h-full w-40 items-center justify-between border-t-2 border-primary bg-background px-3 text-sm font-medium">
          <div className="px-1"></div>
          {tab.panel.title}
          <DotFilledIcon />
        </div>
      </div>

      <ChatPanelTab session={tab} modelsAvailable={modelsAvailable} />
    </>
  )
}

async function dummyUpdateSession() {
  'use server'
}
