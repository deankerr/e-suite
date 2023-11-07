import { cn } from '@/lib/utils'
import { MessageBubble } from '../chat/message-bubble'
import { sampleMessages } from '../chat/sample-data'

export function AgentFeed({ className }: React.ComponentProps<'div'>) {
  const isStreaming = false
  const isWaiting = false

  // const msg = sampleMessages.slice(0, 1)
  const msg = sampleMessages

  return (
    <div className={cn('space-y-4', className)}>
      {msg.map((m) => (
        <MessageBubble
          variant={m.role}
          content={m.content}
          loading={sampleMessages.at(-1)?.id === m.id && isStreaming}
          key={m.id}
        />
      ))}
      {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />}
    </div>
  )
}
