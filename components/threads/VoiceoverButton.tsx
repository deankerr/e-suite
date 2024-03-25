import { UIIconButton } from '@/components/ui/UIIconButton'
import { Voiceover } from '@/convex/threads/threads'
import { AlertCircleIcon, FileQuestionIcon, Loader2Icon, PlayIcon, SquareIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { useAppStore } from '../providers/AppStoreProvider'

type VoiceoverButtonProps = {
  voiceover?: Voiceover
} & Partial<React.ComponentProps<typeof UIIconButton>>

export const VoiceoverButton = forwardRef<HTMLButtonElement, VoiceoverButtonProps>(
  function VoiceoverButton({ voiceover, ...props }, forwardedRef) {
    const url = voiceover?.url
    const job = voiceover?.job?.status

    const voiceoverMessageQueue = useAppStore((state) => state.voiceoverMessageQueue)
    const voiceoverPlay = useAppStore((state) => state.voiceoverPlay)
    const voiceoverStop = useAppStore((state) => state.voiceoverStop)

    const currentMessage = voiceoverMessageQueue?.find(([id]) => voiceover?.messageId === id)
    const currentId = currentMessage?.[0] ?? null
    const currentPlaying = currentMessage?.[1] ?? false

    const getVoiceoverStatus = () => {
      if (!voiceover) return 'none'

      const isCurrent = currentId === voiceover.messageId
      if (url && isCurrent && currentPlaying) return 'playing'
      if (url && isCurrent && !currentPlaying) return 'stopped'
      if (url) return 'available'

      if (job === 'pending') return 'pending'
      if (job === 'error') return 'error'

      return 'none'
    }

    const status = getVoiceoverStatus()

    const statusIcons: Record<ReturnType<typeof getVoiceoverStatus>, React.ReactNode> = {
      available: <PlayIcon />,
      stopped: <PlayIcon />,
      error: <AlertCircleIcon />,
      none: <FileQuestionIcon />,
      pending: <Loader2Icon />,
      playing: <SquareIcon />,
    }

    return (
      <UIIconButton
        {...props}
        label="play voiceover"
        color="grass"
        ref={forwardedRef}
        onClick={() => {
          if (status === 'playing') voiceoverStop()
          else if (url && voiceover.messageId) {
            console.log('btn play')
            voiceoverPlay(voiceover.messageId)
          }
        }}
      >
        {statusIcons[status]}
      </UIIconButton>
    )
  },
)
