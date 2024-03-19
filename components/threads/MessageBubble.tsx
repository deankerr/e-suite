import { Message } from '@/convex/threads/threads'
import { cn } from '@/lib/utils'
import { Heading, Text } from '@radix-ui/themes'
import { MoreHorizontalIcon, SpeechIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { LoaderBars } from '../ui/LoaderBars'
import { UIIconButton } from '../ui/UIIconButton'
import { MessageMenu } from './MessageMenu'

type MessageBubbleProps = {
  message: Message
} & React.ComponentProps<'div'>

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, className, ...props },
  forwardedRef,
) {
  const style = getRoleStyle(message.role)

  return (
    <div
      {...props}
      className={cn(
        'flex w-full max-w-[80ch] flex-col gap-1 rounded border p-3 sm:gap-1',
        className,
      )}
      ref={forwardedRef}
    >
      <div className="flex-between">
        <Heading size="2">{message.name ?? style.role}</Heading>

        <div className="flex gap-2.5">
          <UIIconButton
            icon={SpeechIcon}
            label="speak"
            size="1"
            disabled={!message.voiceover?.url}
          />

          <MessageMenu messageId={message._id}>
            <UIIconButton icon={MoreHorizontalIcon} label="message menu" size="1" />
          </MessageMenu>
        </div>
      </div>

      <div className="prose prose-invert max-w-none">
        {message.content.split('\n').map((p, i) => (
          <Text key={i} as="p">
            {p}
          </Text>
        ))}
      </div>

      {/* pending state */}
      {message.job?.status === 'pending' && <LoaderBars />}
    </div>
  )
})

const roleStyles = {
  user: {
    role: 'User',
  },
  assistant: {
    role: 'Assistant',
  },
  system: {
    role: 'System',
  },
  tool: {
    role: 'Tool',
  },
} as const

const getRoleStyle = (role: string) => {
  if (role in roleStyles) {
    return roleStyles[role as keyof typeof roleStyles]
  }

  return {
    role: role,
  }
}
