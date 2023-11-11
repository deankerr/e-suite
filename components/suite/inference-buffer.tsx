import { useSuite } from '@/lib/use-suite'
import { cn } from '@/lib/utils'
import { MessageBar } from '../chat/message-bar'
import { MessageBubble } from '../chat/message-bubble'
import { useAgentChat } from './use-agent-chat'

export function InferenceBuffer({ className }: React.ComponentProps<'div'>) {
  const { activeTab, agents } = useSuite()

  const agent = agents.find((a) => a.id === activeTab?.agentId)
  const chatId = agent ? agent.id + '-tmpchatId' : ''

  const chat = useAgentChat(chatId, agent)
  const isWaiting = chat.isLoading && !chat.streamingId

  return (
    <div className={cn('relative overflow-y-auto', className)}>
      <div className={cn('min-h-[80%] space-y-4 p-4', className)}>
        {chat.messages.map((m) => (
          <MessageBubble
            variant={m.role}
            content={m.content}
            loading={chat.streamingId === m.id}
            key={m.id}
          />
        ))}
        {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />}
      </div>
      <div className="sticky bottom-0 w-full p-4">
        <MessageBar className="mx-auto" handleSubmit={chat.submitUserMessage} />
      </div>
    </div>
  )
}
