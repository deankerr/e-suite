import { cn } from '@/lib/utils'
import { MessageBar } from '../chat/message-bar'
import { MessageBubble } from '../chat/message-bubble'
import { sampleMessages } from '../chat/sample-data'

export function Feed({ className }: {} & React.ComponentProps<'div'>) {
  // const requestStatus: ReqStat = 'idle'
  const isStreaming = false
  const isWaiting = false

  // const chatHelpers = useAiChat(session, engine)

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {sampleMessages.map((m) => (
          <MessageBubble
            variant={m.role}
            content={m.content}
            loading={sampleMessages.at(-1)?.id === m.id && isStreaming}
            key={m.id}
          />
        ))}
        {isWaiting && <MessageBubble variant="assistant" content="" loading={true} />}
      </div>
      {/* <MessageBar className={cn('')} handleSubmit={() => {}} /> */}
    </>
  )
}
