'use client'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Message } from 'ai'
import { MessageBar } from './message-bar'
import { MessageBubble } from './message-bubble'
import { useAgentChat } from './use-agent-chat'
import { Agent } from '@/data/types'

export function InferenceBuffer({
  agent,
  className,
  ...divProps
}: { agent: Agent } & React.ComponentProps<'div'>) {
  const chatId = agent.id + '-tmpchatId'
  const chat = useAgentChat(chatId, agent)
  const isWaiting = chat.isLoading && !chat.streamingMessageId

  const { user } = useKindeBrowserClient()
  const userAvatar = (user && user.picture) ?? ''

  const avatar = (role: Message['role']) => {
    if (role === 'user') return userAvatar
    if (role === 'assistant') return agent.image
  }

  return (
    <div
      {...divProps}
      className={cn('grid w-full max-w-3xl [&_>*]:col-start-1 [&_>*]:row-start-1', className)}
    >
      <div className={cn('space-y-1 p-6 pb-20')}>
        <Separator />
        {chat.messages.map((m) => (
          <MessageBubble
            variant={m.role}
            avatar={avatar(m.role)}
            content={m.content}
            loading={chat.streamingMessageId === m.id}
            key={m.id}
          />
        ))}
        {chat.messages.length === 0 && (
          <div className="w-full p-6 text-center text-foreground/90">There are no messages.</div>
        )}
        {isWaiting && (
          <MessageBubble variant="assistant" avatar={agent.image} content="" loading={true} />
        )}
      </div>
      <div className="sticky bottom-0 self-end p-4">
        <MessageBar className="mx-auto" chat={chat} />
      </div>
    </div>
  )
}
