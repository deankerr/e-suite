import { Markdown } from '@/components/Markdown'
import type { ChatMessage } from '../Chat'

export function SystemBubble(props: { content: string }) {
  const { content } = props
  return (
    <div className="mx-6 w-auto">
      <div className="text-sm text-transparent">System</div>
      <div className="rounded-xl bg-accent px-4 py-1 text-center text-accent-content shadow-lg">
        {content}
      </div>
    </div>
  )
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}>
      <div className="chat-header text-transparent">
        {message.name ?? (isUser ? 'User' : 'Assistant')}
      </div>
      <div
        className={`chat-bubble ${
          isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'
        } prose shadow-lg`}
      >
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  )
}
