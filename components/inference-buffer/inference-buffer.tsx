'use client'

import { cn } from '@/lib/utils'
import { useAgentQuery, useEngineQuery, useTabs } from '../suite/queries'
import { useAgentChat } from '../suite/use-agent-chat'
import { MessageBar } from './message-bar'
import { MessageBubble } from './message-bubble'

export function InferenceBuffer({ className, ...divProps }: React.ComponentProps<'div'>) {
  const { focusedTab } = useTabs()
  const { data: agent } = useAgentQuery(focusedTab?.agentId)
  const { data: engine } = useEngineQuery(agent?.engineId)

  const chatId = agent ? agent.id + '-tmpchatId' : ''

  const chat = useAgentChat(chatId, agent, engine)
  const isWaiting = chat.isLoading && !chat.streamingId

  return (
    <div
      {...divProps}
      className={cn('grid justify-normal [&_>*]:col-start-1 [&_>*]:row-start-1', className)}
    >
      <div className={cn('max-w-3xl space-y-4 p-6', className)}>
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
      <div className="sticky bottom-0 w-full self-end p-4">
        <MessageBar className="mx-auto" chat={chat} />
      </div>
    </div>
  )
}
