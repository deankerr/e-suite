import type { ChatMessageItem } from '../page'

export function SystemBubble(props: { content: string }) {
  const { content } = props
  return (
    <div className="mx-auto max-w-sm">
      <div className="text-sm text-transparent">System</div>
      <div className="rounded-xl bg-accent px-4 py-1 text-center shadow-lg">{content}</div>
    </div>
  )
}

export function MessageBubble({ message }: { message: ChatMessageItem }) {
  const isUser = message.role === 'user'
  const color = isUser ? 'chat-bubble-primary' : 'chat-bubble-secondary'
  const alignment = isUser ? 'chat-start' : 'chat-end'
  const name = message.name ?? (isUser ? 'User' : 'Assistant')

  return (
    <div className={`chat ${alignment}`}>
      <div className="chat-header text-transparent">{name}</div>
      <div className={`chat-bubble ${color} shadow-lg`}>{message.content}</div>
    </div>
  )
}
