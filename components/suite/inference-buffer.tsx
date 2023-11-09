import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { MessageBar } from '../chat/message-bar'
import { MessageBubble } from '../chat/message-bubble'
import { sampleMessages } from '../chat/sample-data'
import { Loading } from '../ui/loading'
import { getAgent } from './actions'
import { useAgentChat } from './use-agent-chat'

export function InferenceBuffer({
  agentId,
  className,
  children,
}: { agentId: string } & React.ComponentProps<'div'>) {
  const isEnabled = agentId !== ''

  const {
    data: agent,
    isPending,
    error,
  } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => getAgent(agentId),
    enabled: isEnabled,
  })

  const chatId = agent ? agent.id + '-tmpchatId' : ''

  const chat = useAgentChat(chatId, agent)

  //& temp
  const isStreaming = false
  const isWaiting = false

  return (
    <div className={cn('relative overflow-y-auto', className)}>
      <div className={cn('space-y-4', className)}>
        <div className="font-mono text-xs">
          InferenceBuffer {chatId} / {agent?.id} / {agent?.engineId}
          {error && <span>Error: {error.message}</span>}
          {!isEnabled && <span>not enabled</span>}
        </div>
        {isPending && <Loading />}

        {chat.messages.map((m) => (
          <MessageBubble
            variant={m.role}
            content={m.content}
            loading={chat.messages.at(-1)?.id === m.id && isStreaming}
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
