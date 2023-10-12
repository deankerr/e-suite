import { Markdown } from '@/components/markdown'
import { cn } from '@/lib/utils'
import { Message } from 'ai'

type Props = {
  message: Message
}

export function ChatMessageBubble({ message }: Props) {
  const m = message
  const showLoaderId = 'no'

  const isUser = m.role === 'user'
  const isAi = m.role === 'assistant'
  const content = showLoaderId === m.id ? m.content + '[icon](loadingball)' : m.content
  return (
    <div className={cn('max-w-[95%]', { 'self-end': isUser, 'self-center': !(isUser || isAi) })}>
      <div
        className={cn('prose prose-stone rounded-lg px-3 py-2 dark:prose-invert', {
          'self-end bg-primary text-primary-foreground': isUser,
          'bg-muted text-secondary-foreground': isAi,
          'self-center bg-secondary text-center text-secondary-foreground': !(isUser || isAi),
        })}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}
