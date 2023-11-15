import { cn } from '@/lib/utils'
import { useAgentQuery, useEngineQuery, useTabs } from '../suite/queries'
import { useAgentChat } from '../suite/use-agent-chat'
import { MessageBar } from './message-bar'
import { MessageBubble } from './message-bubble'

export function InferenceBuffer({ className }: React.ComponentProps<'div'>) {
  const { focusedTab } = useTabs()
  const { data: agent } = useAgentQuery(focusedTab?.agentId)
  const { data: engine } = useEngineQuery(agent?.engineId)

  const chatId = agent ? agent.id + '-tmpchatId' : ''

  const chat = useAgentChat(chatId, agent, engine)
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
