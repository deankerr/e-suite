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
  const engineId = agent ? agent.engineId : ''
  const agentName = agent ? agent.name : ''

  const chat = useAgentChat({ chatId, agentName, engineId })

  //& temp
  const isStreaming = false
  const isWaiting = false

  return (
    <div className="relative">
      <div className={cn('space-y-4', className)}>
        <div className="font-mono text-xs">
          InferenceBuffer {chatId} / {engineId}
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
      <div className="absolute bottom-0 w-full p-2">
        <MessageBar className="mx-auto" handleSubmit={chat.submitUserMessage} />
      </div>
    </div>
  )
}
