type ChatMessageItem = {
  role: 'system' | 'user' | 'assistant'
  name?: string
  content: string
}

export default function Chat() {
  return (
    <div className="min-h-full min-w-full bg-base-300">
      <div className="flex flex-col justify-end min-h-screen max-w-md mx-auto bg-base-100">
        <div className="px-2 pb-2">
          {_sampleMessages.map((m, i) => (
            <MessageItem message={m} key={i} />
          ))}
        </div>
        <div className="flex justify-center bg-base-200 py-2">
          <InputBox />
        </div>
      </div>
    </div>
  )
}

const bubbleColor: Record<string, string> = {
  system: 'chat-bubble-accent',
  user: 'chat-bubble-primary',
  assistant: 'chat-bubble-secondary',
}

function MessageItem({ message }: { message: ChatMessageItem }) {
  const color = bubbleColor[message.role]
  const alignment = message.role === 'assistant' ? 'chat-end' : 'chat-start'
  const name = message.name ?? message.role

  if (message.role === 'system') {
    return (
      <div className="max-w-sm mx-auto">
        <div className="text-sm">system</div>
        <div className="bg-accent px-4 py-1 text-center rounded-lg">{message.content}</div>
      </div>
    )
  }

  return (
    <div className={`chat ${alignment}`}>
      <div className="chat-header">{name}</div>
      <div className={`chat-bubble ${color}`}>{message.content}</div>
    </div>
  )
}

function InputBox() {
  return (
    <textarea
      placeholder="Enter your message..."
      className="textarea textarea-bordered textarea-sm w-full max-w-xs"
    ></textarea>
  )
}

const _sampleMessages: ChatMessageItem[] = [
  { role: 'system', content: 'Adipisicing exercitation ut sit aute fugiat duis enim ad.' },
  {
    role: 'user',
    name: 'Katelynn',
    content: 'Elit quis ut nisi aliquip cupidatat occaecat aute laboris velit laborum.',
  },
  {
    role: 'assistant',
    content:
      'Labore duis anim commodo minim tempor mollit et dolore enim exercitation minim. Adipisicing in do duis mollit nisi duis amet ipsum quis. Minim est amet aliquip nisi consectetur laboris quis nulla exercitation sit excepteur eu. Et tempor ex fugiat tempor cillum. Nostrud officia esse veniam mollit irure.',
  },
]
