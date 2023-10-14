import { Markdown } from '@/components/markdown'
import { cn } from '@/lib/utils'
import { ChatMessage } from './types'

type Props = {
  message: ChatMessage | null
  showLoader?: boolean
}

export function ChatMessageBubble({ message, showLoader }: Props) {
  if (message?.hidden) return null

  const m = message ?? { role: 'assistant', content: '' }

  const isUser = m.role === 'user'
  const isAi = m.role === 'assistant'
  const isOther = !(isUser || isAi)

  const content = showLoader ? m.content + '[icon](loadingball)' : m.content
  return (
    <div className={cn('max-w-[95%]', { 'self-end': isUser, 'self-start': isAi })}>
      <div
        className={cn('prose prose-stone rounded-lg px-3 py-2 dark:prose-invert', {
          'bg-primary text-primary-foreground': isUser,
          'bg-muted text-secondary-foreground': isAi,
          'bg-secondary text-center text-secondary-foreground': isOther,
        })}
      >
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}
