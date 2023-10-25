import { Button } from '@/components/ui/button'
import { chatsConfig } from '@/config/chats'
import { getAvailableChatModels } from '@/lib/api'
import { cn } from '@/lib/utils'
import { MixerHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import { ChatContent } from './chat-content'

function getChatConfig(name: string) {
  const chat = chatsConfig.find((c) => c.name === decodeURI(name))
  if (!chat) throw new Error(`Unable to find chat config for ${name}`)
  const model = getAvailableChatModels().find((m) => m.id === chat.modelId)
  if (!model) throw new Error(`Unable to find model id ${chat.modelId} for ${name}`)
  return { chat, model }
}

export default function ChatNamePage({ params }: { params: { name: string } }) {
  const { chat, model } = getChatConfig(params.name)

  return (
    <div className="chat-tab-grid">
      {/* Header */}
      <div className="chat-tab-header flex items-center justify-between text-sm text-muted-foreground shadow-md">
        <div className="pl-2 font-mono text-xs">
          {chat.id}/{chat.name}
        </div>
        <div>{model.label}</div>
        <div>
          <Button
            className={cn('rounded-none border-transparent shadow-none', 'border-l-input')}
            variant="outline"
          >
            <MixerHorizontalIcon />
          </Button>
          <Button
            className={cn('rounded-none border-transparent shadow-none', 'border-l-input')}
            variant="outline"
          >
            <TrashIcon />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ChatContent chat={chat} />

      {/* Status */}
      <div className="chat-tab-status flex items-center justify-center border-t px-2 py-1 text-sm text-muted-foreground">
        Press Enter ⏎ for a new line / Press ⌘ + Enter to send
      </div>
    </div>
  )
}
