import { UIIconButton } from '@/components/ui/UIIconButton'
import { Voiceover } from '@/convex/threads/threads'
import {
  AlertCircleIcon,
  FileQuestionIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  PlayIcon,
  SnailIcon,
  SquareIcon,
} from 'lucide-react'
import { forwardRef } from 'react'
import { useGlobalAudioPlayer } from 'react-use-audio-player'
import { useAppStore } from '../providers/AppStoreProvider'

type VoiceoverButtonProps = {
  voiceover?: Voiceover
} & Partial<React.ComponentProps<typeof UIIconButton>>

export const VoiceoverButton = forwardRef<HTMLButtonElement, VoiceoverButtonProps>(
  function VoiceoverButton({ voiceover, ...props }, forwardedRef) {
    const url = voiceover?.url
    const job = voiceover?.job?.status

    const queue = useAppStore((state) => state.voiceoverMessageQueue)
    const voiceoverPlay = useAppStore((state) => state.voiceoverPlay)
    const voiceoverStop = useAppStore((state) => state.voiceoverStop)

    const [currentId] = queue?.find(([_, status]) => status) ?? []
    const selfIsCurrent = currentId === voiceover?.messageId

    const [queuedId] = queue?.find(([id, status]) => voiceover?.messageId === id && status) ?? []
    const selfIsQueued = queuedId === voiceover?.messageId

    const { isLoading, playing } = useGlobalAudioPlayer()

    const getVoiceoverStatus = () => {
      if (!voiceover) return 'unknown'
      if (job === 'error') return 'error'
      if (job === 'pending') return 'pending'
      if (selfIsCurrent && playing) return 'playing'
      if (selfIsCurrent && isLoading) return 'loading'
      if (selfIsCurrent && !playing) return 'ready'
      if (!selfIsCurrent && selfIsQueued) return 'queued'
      if (url) return 'available'

      return 'unknown'
    }

    const status = getVoiceoverStatus()

    const statusIcons: Record<ReturnType<typeof getVoiceoverStatus>, React.ReactNode> = {
      playing: <SquareIcon />,
      ready: <SnailIcon />,
      queued: <MoreHorizontalIcon />,
      available: <PlayIcon />,
      loading: <Loader2Icon className="animate-spin" />,
      pending: <Loader2Icon className="animate-spin" />,
      error: <AlertCircleIcon />,
      unknown: <FileQuestionIcon />,
    }

    return (
      <UIIconButton
        {...props}
        label="play voiceover"
        ref={forwardedRef}
        disabled={status === 'unknown'}
        onClick={() => {
          if (status === 'playing') voiceoverStop()
          else if (voiceover?.messageId) {
            voiceoverPlay(voiceover.messageId)
          }
        }}
      >
        {statusIcons[status]}
      </UIIconButton>
    )
  },
)
