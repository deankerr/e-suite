import type { ChatMessageItem } from '../page'

export function SystemBubble(props: { content: string }) {
  const { content } = props
  return (
    <div className="mx-auto max-w-sm">
      <div className="text-sm">System</div>
      <div className="rounded-lg bg-accent px-4 py-1 text-center">{content}</div>
    </div>
  )
}

export function MessageBubble({ message }: { message: ChatMessageItem }) {
  const { role } = message
  const color = role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
  const alignment = role === 'user' ? 'chat-start' : 'chat-end'
  const name = message.name ?? (role === 'user' ? 'User' : 'Assistant')

  return (
    <div className={`chat ${alignment}`}>
      <div className="chat-header">{name}</div>
      <div className={`chat-bubble ${color}`}>{message.content}</div>
    </div>
  )
}
