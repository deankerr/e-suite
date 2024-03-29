import { forwardRef } from 'react'
import { Heading, Text } from '@radix-ui/themes'
import { MoreVerticalIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { LoaderBars } from '../ui/LoaderBars'
import { UIIconButton } from '../ui/UIIconButton'
import { MessageMenu } from './MessageMenu'
import { VoiceoverButton } from './VoiceoverButton'

import type { Message } from '@/convex/threads/threads'

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
      className={cn('flex w-full max-w-3xl flex-col gap-1 rounded border p-3', className)}
      ref={forwardedRef}
    >
      <div className="flex-between max-w-[88vw]">
        <Heading size="2">{message.name ?? style.role}</Heading>

        <div className="flex gap-2.5">
          <VoiceoverButton voiceover={message.voiceover} />
          <MessageMenu messageId={message._id}>
            <UIIconButton icon={MoreVerticalIcon} label="message menu" size="1" />
          </MessageMenu>
        </div>
      </div>

      <div className="max-w-[88vw]">
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
