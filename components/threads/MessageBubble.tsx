import { Message } from '@/convex/threads/threads'
import { cn } from '@/lib/utils'
import { Heading, Text } from '@radix-ui/themes'
import {
  FileQuestionIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  SquareIcon,
  Volume2Icon,
} from 'lucide-react'
import { forwardRef } from 'react'
import { LoaderBars } from '../ui/LoaderBars'
import { UIIconButton } from '../ui/UIIconButton'
import { MessageMenu } from './MessageMenu'
import { useVoiceoverPlayer } from './useVoiceoverPlayer'

type MessageBubbleProps = {
  message: Message
  voiceover: ReturnType<typeof useVoiceoverPlayer>[number]
} & React.ComponentProps<'div'>

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(function MessageBubble(
  { message, voiceover, className, ...props },
  forwardedRef,
) {
  const style = getRoleStyle(message.role)

  const getVoiceoverIcon = () => {
    if (voiceover.isPlaying) return SquareIcon
    if (voiceover.isLoading || voiceover.isPending) return Loader2Icon
    if (voiceover.isError) return FileQuestionIcon
    return Volume2Icon
  }

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
            icon={getVoiceoverIcon()}
            label="play voiceover"
            size="1"
            disabled={!voiceover.isAvailable}
            color={voiceover.isAvailable ? undefined : 'gray'}
            className={cn((voiceover.isLoading || voiceover.isPending) && 'animate-spin')}
            onClick={() => (voiceover.isPlaying ? voiceover.stop() : voiceover.play())}
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
