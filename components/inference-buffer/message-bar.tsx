import { Button } from '@/components/ui/button'
import { TextareaAutosize } from '@/components/ui/textarea-autosize'
import { cn } from '@/lib/utils'
import { HeartIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { MessageBarMenu } from './message-bar-menu'
import { AgentChatHelpers } from './use-agent-chat'

export function MessageBar({
  chat,
  className,
  ...props
}: { chat: AgentChatHelpers } & React.ComponentProps<'div'>) {
  const send = () => {
    if (chat.input === '') return
    chat.submitUserMessage(chat.input)
    chat.setInput('')
  }

  return (
    <div
      {...props}
      className={cn(
        'flex w-full items-end rounded-3xl border-2 bg-background px-2 py-2 focus-within:ring-1 focus-within:ring-ring',
        className,
      )}
    >
      <MessageBarMenu chat={chat}>
        <Button
          className="rounded-2xl border-2"
          variant="outline"
          type="button"
          onClick={() => {
            // chat.setMessages([...chat.messages, ...sampleConvo])
          }}
        >
          <HeartIcon />
        </Button>{' '}
      </MessageBarMenu>
      <TextareaAutosize
        className="w-full resize-none bg-transparent px-2 py-1.5 placeholder:text-muted-foreground focus-visible:outline-none"
        placeholder="Speak..."
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.metaKey) {
            send()
          }
        }}
        value={chat.input}
        onChange={(e) => chat.setInput(e.target.value)}
      />
      <Button
        className="rounded-2xl border-2"
        variant={chat.input !== '' ? 'default' : 'outline'}
        onClick={send}
      >
        <PaperPlaneIcon />
      </Button>
    </div>
  )
}
