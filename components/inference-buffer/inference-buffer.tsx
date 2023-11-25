'use client'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Agent, AgentDetail } from '@/schema/user'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Message } from 'ai'
import { MessageBar } from './message-bar'
import { MessageBubbleNext } from './message-bubble-next'
import { useAgentChat } from './use-agent-chat'

export function InferenceBuffer({
  agent,
  className,
  ...divProps
}: { agent: AgentDetail } & React.ComponentProps<'div'>) {
  const chatId = agent ? agent.id + '-tmpchatId' : ''
  const chat = useAgentChat(chatId, agent)
  const isWaiting = chat.isLoading && !chat.streamingId

  const { user } = useKindeBrowserClient()
  const userAvatar = (user && user.picture) ?? ''

  const avatar = (role: Message['role']) => {
    if (role === 'user') return userAvatar
    if (role === 'assistant') return '/' + agent.image
  }

  return (
    <div
      {...divProps}
      className={cn('grid justify-center [&_>*]:col-start-1 [&_>*]:row-start-1', className)}
    >
      <div className={cn('max-w-3xl space-y-1 p-6 pb-20')}>
        <Separator />
        {chat.messages.map((m) => (
          <MessageBubbleNext
            variant={m.role}
            avatar={avatar(m.role)}
            content={m.content}
            loading={chat.streamingId === m.id}
            key={m.id}
          />
        ))}
        {/* {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />} */}
      </div>
      <div className="sticky bottom-0 w-full max-w-3xl self-end p-4">
        <MessageBar className="mx-auto" chat={chat} />
      </div>
    </div>
  )
}
