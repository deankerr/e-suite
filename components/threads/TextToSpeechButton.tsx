import { forwardRef } from 'react'
import { useMutation } from 'convex/react'
import { AlertCircleIcon, FileQuestionIcon, Loader2Icon, PlayIcon } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { UIIconButton } from '../ui/UIIconButton'

import type { Message } from '@/convex/threads/threads'

type TextToSpeechButtonProps = {
  message: Message
} & Partial<React.ComponentProps<typeof UIIconButton>>

export const TextToSpeechButton = forwardRef<HTMLButtonElement, TextToSpeechButtonProps>(
  function TextToSpeechButton({ message, className, ...props }, forwardedRef) {
    const createTextToSpeech = useMutation(api.threads.threads.createTextToSpeech)

    const handleClick = () => {
      async function send() {
        try {
          await createTextToSpeech({ messageId: message._id })
          toast.success('TTS request sent.')
        } catch (err) {
          console.error(err)
          toast.error('TTS request failed.')
        }
      }

      send()
    }

    const { speech } = message
    const url = speech?.url

    const isNone = !speech
    const isPending = speech && !url
    const isReady = !!url

    return (
      <UIIconButton
        label="play voiceover"
        {...props}
        className={cn('', className)}
        ref={forwardedRef}
        onClick={() => {
          if (isNone) void handleClick()
        }}
      >
        {isNone ? (
          <FileQuestionIcon />
        ) : isPending ? (
          <Loader2Icon />
        ) : isReady ? (
          <PlayIcon />
        ) : (
          <AlertCircleIcon />
        )}
      </UIIconButton>
    )
  },
)
