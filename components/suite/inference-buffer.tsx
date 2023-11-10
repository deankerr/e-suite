import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { MessageBar } from '../chat/message-bar'
import { MessageBubble } from '../chat/message-bubble'
import { sampleMessages } from '../chat/sample-data'
import { Loading } from '../ui/loading'
import { getSuiteUser } from './actions'
import { useAgentChat } from './use-agent-chat'

export function InferenceBuffer({
  agentId,
  className,
  children,
}: { agentId: string } & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  const workbench = user ? user.workbench : undefined

  const activeTab = workbench
    ? workbench.tabs.find((tab) => tab.id === workbench.active)
    : undefined
  const agent = activeTab && user ? user.agents.find((a) => a.id === activeTab.agentId) : undefined

  const chatId = agent ? agent.id + '-tmpchatId' : ''

  const chat = useAgentChat(chatId, agent)

  if (!user || error) return <div></div>
  if (isPending)
    return (
      <div>
        <Loading />
      </div>
    )

  //& temp
  const isWaiting = chat.isLoading && !chat.streamingId

  return (
    <div className={cn('relative overflow-y-auto', className)}>
      <div className={cn('min-h-[80%] space-y-4 p-4', className)}>
        {isPending && <Loading />}

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
